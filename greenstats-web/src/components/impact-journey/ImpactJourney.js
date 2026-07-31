"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  LoaderCircle,
  RefreshCcw,
  RotateCcw,
  X,
} from "lucide-react";

import {
  formatVnd,
  getAnimatedItems,
  getImpactSummary,
  isContributionValid,
} from "@/lib/impact";
import impactTreeModel from "@/data/impact-tree-model.json";

import { BrandMark } from "../BrandMark";
import { ImpactDetailsSheet } from "./ImpactDetailsSheet";
import { ImpactTreeNetwork } from "./ImpactTreeNetwork";
import styles from "./impactJourney.module.css";

const PARTICLES = Array.from({ length: 42 }, (_, index) => ({
  id: index,
  x: (index * 37 + 13) % 100,
  y: (index * 23 + 7) % 42,
  drift: ((index * 29) % 86) - 43,
  delay: (index % 9) * 40,
  size: 2 + (index % 3),
}));

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

export function ImpactJourney({
  open,
  onOpenChange,
  data,
  status = "ready",
  onRetry,
}) {
  const [scene, setScene] = useState("idle");
  const [selectedItem, setSelectedItem] = useState(null);
  const [displayAmount, setDisplayAmount] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const closeButtonRef = useRef(null);
  const overlayRef = useRef(null);
  const previousFocusRef = useRef(null);
  const sequenceRef = useRef(null);
  const animationFrameRef = useRef(null);

  const items = useMemo(() => getAnimatedItems(data.impactItems), [data]);
  const summary = useMemo(() => getImpactSummary(data), [data]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && !isContributionValid(data)) {
      console.warn(
        `[ImpactJourney] Allocation for ${data.ticketId} does not match the contribution total.`,
      );
    }
  }, [data]);

  const stopSequence = useCallback(() => {
    sequenceRef.current?.abort();
    sequenceRef.current = null;
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const startCountUp = useCallback(
    (signal) => {
      const duration = 1080;
      const startedAt = performance.now();

      const tick = (now) => {
        if (signal.aborted) return;
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayAmount(Math.round(data.totalContribution * eased));

        if (progress < 1) {
          animationFrameRef.current = window.requestAnimationFrame(tick);
        }
      };

      setDisplayAmount(0);
      animationFrameRef.current = window.requestAnimationFrame(tick);
    },
    [data.totalContribution],
  );

  const playSequence = useCallback(
    async (replay = false) => {
      stopSequence();
      const controller = new AbortController();
      const { signal } = controller;
      sequenceRef.current = controller;
      setSelectedItem(null);

      if (isReducedMotion || items.length === 0) {
        setDisplayAmount(data.totalContribution);
        setScene("complete");
        return;
      }

      try {
        setScene("destination");
        await wait(replay ? 850 : 1150, signal);

        setScene("contribution");
        startCountUp(signal);
        await wait(1650, signal);

        setDisplayAmount(data.totalContribution);
        setScene("particle-flow");
        await wait(1050, signal);

        setScene("root-growth");
        await wait(impactTreeModel.timeline.totalDurationMs, signal);
        setScene("complete");
        window.sessionStorage.setItem(
          `impact-journey:${data.ticketId}`,
          "viewed",
        );
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error(error);
        }
      }
    },
    [
      data.ticketId,
      data.totalContribution,
      isReducedMotion,
      items.length,
      startCountUp,
      stopSequence,
      setScene,
    ],
  );

  useEffect(() => {
    if (!open) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reducedMotion = mediaQuery.matches;
    setIsReducedMotion(reducedMotion);
    previousFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const hasViewed = window.sessionStorage.getItem(
      `impact-journey:${data.ticketId}`,
    );

    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    if (status === "ready") {
      if (hasViewed || reducedMotion) {
        setDisplayAmount(data.totalContribution);
        setScene("complete");
      } else {
        void playSequence();
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
        return;
      }

      if (event.key !== "Tab" || !overlayRef.current) return;
      const focusable = Array.from(
        overlayRef.current.querySelectorAll(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      stopSequence();
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [
    data.ticketId,
    data.totalContribution,
    items.length,
    onOpenChange,
    open,
    playSequence,
    status,
    stopSequence,
    setScene,
  ]);

  const close = useCallback(() => {
    stopSequence();
    onOpenChange(false);
  }, [onOpenChange, stopSequence]);

  const handleDialogKeyDown = (event) => {
    if (event.key === "Escape") close();
  };

  if (!open) return null;

  const showContribution =
    scene === "contribution" || scene === "particle-flow";
  const showCompactHeader =
    scene === "root-growth" ||
    scene === "revealing-items" ||
    scene === "complete";

  return (
    <div
      ref={overlayRef}
      className={`${styles.overlay} ${styles[`scene-${scene}`]}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="impact-journey-title"
      aria-describedby="impact-journey-summary"
      onKeyDown={handleDialogKeyDown}
    >
      <picture className={styles.background}>
        {data.backgroundImageMobile && (
          <source
            media="(max-width: 680px)"
            srcSet={data.backgroundImageMobile}
          />
        )}
        <img src={data.backgroundImage} alt="" />
      </picture>
      <div className={styles.backgroundVeil} aria-hidden="true" />
      <div className={styles.ambientLight} aria-hidden="true" />

      <header className={styles.topBar}>
        <span className={styles.overlayBrand}>
          <BrandMark />
          <span>
            Green<strong>Stats</strong>
          </span>
        </span>
        <span className={styles.sequenceMeta}>
          Impact journey
          <i aria-hidden="true" />
          {data.ticketId}
        </span>
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.closeButton}
          onClick={close}
          aria-label="Đóng hành trình tác động"
        >
          <X size={19} />
        </button>
      </header>

      <p id="impact-journey-summary" className={styles.srOnly}>
        {summary}
      </p>

      {status === "loading" && (
        <div className={styles.statusState} role="status">
          <span className={styles.loadingRoot}>
            <LoaderCircle size={28} />
          </span>
          <p>Đang tái hiện hành trình tác động…</p>
        </div>
      )}

      {status === "error" && (
        <div className={styles.statusState} role="alert">
          <span className={styles.statusEyebrow}>Kết nối tạm gián đoạn</span>
          <h2>Chưa thể tải hành trình tác động của vé.</h2>
          <p>Vui lòng thử lại sau.</p>
          <div className={styles.errorActions}>
            <button type="button" onClick={onRetry}>
              <RefreshCcw size={16} />
              Thử lại
            </button>
            <button type="button" onClick={close}>
              Đóng
            </button>
          </div>
        </div>
      )}

      {status === "ready" && (
        <>
          <section
            className={`${styles.destinationScene} ${
              scene === "destination" ? styles.sceneVisible : ""
            }`}
            aria-hidden={scene !== "destination"}
          >
            <div className={styles.eyebrow}>
              <span />
              {data.destinationEyebrow ?? "Điểm đến xanh"}
              <span />
            </div>
            <h1 id="impact-journey-title">
              Hành trình
              <strong>tác động</strong>
            </h1>
            <p>{data.destinationName}</p>
          </section>

          <section
            className={`${styles.contributionScene} ${
              showContribution ? styles.sceneVisible : ""
            } ${scene === "particle-flow" ? styles.dispersing : ""}`}
            aria-hidden={!showContribution}
          >
            <span>Tổng đóng góp</span>
            <strong>{formatVnd(displayAmount)}</strong>
            <p>Khoản đóng góp đang được chuyển hóa thành tác động cụ thể.</p>
          </section>

          <div
            className={`${styles.particleLayer} ${
              scene === "particle-flow" ? styles.particlesActive : ""
            }`}
            aria-hidden="true"
          >
            {PARTICLES.map((particle) => (
              <i
                key={particle.id}
                style={
                  {
                    "--particle-x": `${43 + particle.x * 0.14}%`,
                    "--particle-y": `${39 + particle.y * 0.2}%`,
                    "--particle-drift": `${particle.drift}px`,
                    "--particle-delay": `${particle.delay}ms`,
                    "--particle-size": `${particle.size}px`,
                  }
                }
              />
            ))}
            <span className={styles.energyStream} />
          </div>

          {showCompactHeader && (
            <section
              className={`${styles.compactHeader} ${
                scene === "complete" ? styles.compactHeaderComplete : ""
              }`}
            >
              <span className={styles.compactEyebrow}>
                {data.destinationEyebrow}
              </span>
              <h2>{data.destinationName}</h2>
              <div className={styles.compactContribution}>
                <span>Đóng góp</span>
                <strong>{formatVnd(data.totalContribution)}</strong>
              </div>
            </section>
          )}

          {items.length > 0 ? (
            <ImpactTreeNetwork
              items={items}
              scene={scene}
              selectedItemId={selectedItem?.id ?? null}
              onSelect={(item) =>
                scene === "complete" && setSelectedItem(item)
              }
            />
          ) : (
            scene === "complete" && (
              <div className={styles.emptyState}>
                <span>{formatVnd(data.totalContribution)}</span>
                <h2>Dữ liệu phân bổ đang được cập nhật</h2>
                <p>Thông tin tác động chi tiết sẽ sớm xuất hiện tại đây.</p>
              </div>
            )
          )}

          <section
            className={`${styles.closingMessage} ${
              scene === "complete" ? styles.sceneVisible : ""
            }`}
            aria-live="polite"
          >
            <span>Cảm ơn bạn</span>
            <p>{data.closingMessage}</p>
          </section>

          {scene === "complete" && (
            <div className={styles.controls}>
              <button
                type="button"
                onClick={() => void playSequence(true)}
                className={styles.replayButton}
              >
                <RotateCcw size={15} />
                Xem lại hành trình
              </button>
              <button type="button" onClick={close} className={styles.backButton}>
                <ArrowLeft size={15} />
                Quay lại vé
              </button>
            </div>
          )}

          {selectedItem && scene === "complete" && (
            <ImpactDetailsSheet
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
            />
          )}

          <div className={styles.progress} aria-hidden="true">
            <span>Hành trình tác động</span>
            <i>
              <b
                style={{
                  width:
                    scene === "complete"
                      ? "100%"
                      : `${Math.max(
                          7,
                          [
                            "idle",
                            "destination",
                            "contribution",
                            "particle-flow",
                            "root-growth",
                            "revealing-items",
                          ].indexOf(scene) * 18,
                        )}%`,
                }}
              />
            </i>
            <span className={styles.escHelper}>ESC để đóng</span>
          </div>
        </>
      )}
    </div>
  );
}
