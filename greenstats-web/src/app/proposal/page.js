"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Focus,
  Grid2X2,
  Maximize2,
  Minimize,
  Minimize2,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import HTMLFlipBook from "react-pageflip";

import Navbar from "@/components/Navbar";

import styles from "./proposal.module.css";

const PAGE_COUNT = 20;
const LAST_PAGE_INDEX = PAGE_COUNT - 1;
const INTERIOR_SPREAD_COUNT = (PAGE_COUNT - 2) / 2;
const EXPERIENCE_URL =
  "https://www.greenstats.site/destinations/nam-cat-tien/impact";
const EXPERIENCE_PAGE_POSITION = { x: 82.46, y: 88.51 };

const SPREADS = [
  { label: "Bìa trước", pages: [1], type: "cover" },
  ...Array.from({ length: INTERIOR_SPREAD_COUNT }, (_, index) => ({
    label: `Trang ${index * 2 + 2}–${index * 2 + 3}`,
    pages: [index * 2 + 2, index * 2 + 3],
    type: "spread",
  })),
  { label: "Bìa sau", pages: [PAGE_COUNT], type: "back" },
];

function pageIndexToSpreadIndex(pageIndex) {
  if (pageIndex <= 0) return 0;
  if (pageIndex >= LAST_PAGE_INDEX) return SPREADS.length - 1;
  return Math.floor((pageIndex + 1) / 2);
}

function spreadIndexToPageIndex(spreadIndex) {
  if (spreadIndex <= 0) return 0;
  if (spreadIndex >= SPREADS.length - 1) return LAST_PAGE_INDEX;
  return spreadIndex * 2 - 1;
}

const ProposalPageSheet = forwardRef(function ProposalPageSheet(
  { number },
  ref,
) {
  const isCover = number === 1;
  const isBack = number === PAGE_COUNT;
  const side = number % 2 === 0 ? "leftPage" : "rightPage";
  const pageType = isCover ? "cover" : isBack ? "back" : "inside";

  return (
    <article
      ref={ref}
      data-density={isCover || isBack ? "hard" : "soft"}
      className={`${styles.paper} ${styles[side]} ${styles[pageType]}`}
      aria-label={`Trang ${number}`}
    >
      <Image
        className={styles.pageArtwork}
        src={`/proposal/pages/${String(number).padStart(2, "0")}.jpg`}
        alt={`Nội dung trang ${number} của Green Marketing Proposal`}
        fill
        sizes="(max-width: 760px) 94vw, 520px"
        priority={number <= 3}
        loading={number === PAGE_COUNT ? "eager" : undefined}
        draggable={false}
      />
      {number === 6 && (
        <a
          className={styles.experienceLink}
          href={EXPERIENCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            left: `${EXPERIENCE_PAGE_POSITION.x}%`,
            top: `${EXPERIENCE_PAGE_POSITION.y}%`,
          }}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
          aria-label="Trải nghiệm hành trình tác động tại Nam Cát Tiên"
        >
          Trải nghiệm
        </a>
      )}
      <span className={styles.pageEdge} aria-hidden="true" />
    </article>
  );
});

ProposalPageSheet.displayName = "ProposalPageSheet";

function Intro({ launching, onStart }) {
  return (
    <motion.div
      className={`${styles.intro} ${launching ? styles.introLaunching : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: launching ? 0 : 1 }}
      transition={{ duration: launching ? 0.7 : 0.5 }}
    >
      <Navbar active="proposal" />
      <header className={styles.hero}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.eyebrow}>
            <BookOpen size={15} /> Green marketing proposal · 20 trang A4
          </span>
          <h1>
            Một ý tưởng.
            <br />
            <em>Hai mươi trang.</em>
          </h1>
          <p>
            Không gian trình chiếu proposal GreenStats được kể như một cuốn
            sách — tĩnh lặng, tập trung và giàu chiều sâu.
          </p>
          <button
            type="button"
            onClick={onStart}
            className={styles.start}
            disabled={launching}
          >
            {launching ? "Đang mở sách" : "Mở cuốn sách"} <ArrowDown size={17} />
          </button>
        </motion.div>
        <motion.div
          className={`${styles.heroBook} ${launching ? styles.heroBookLaunching : ""}`}
          initial={{ opacity: 0, rotate: 9, y: 30 }}
          animate={{
            opacity: 1,
            rotate: launching ? 0 : 5,
            y: 0,
            scale: launching ? 1.16 : 1,
          }}
          transition={{
            duration: 1,
            delay: 0.18,
            ease: [0.16, 1, 0.3, 1],
          }}
          aria-hidden="true"
        >
          <div className={styles.bookModel}>
            <div className={styles.bookFront}>
              <Image
                src="/proposal/pages/01.jpg"
                alt=""
                fill
                sizes="360px"
                priority
              />
            </div>
            <div className={styles.bookBack}>
              <Image
                src="/proposal/pages/20.jpg"
                alt=""
                fill
                sizes="360px"
                loading="eager"
              />
            </div>
            <span className={styles.bookRightEdge} />
            <span className={styles.bookSpine} />
            <span className={styles.bookTopEdge} />
            <span className={styles.bookBottomEdge} />
          </div>

        </motion.div>
      </header>
    </motion.div>
  );
}

export default function ProposalPage() {
  const bookRef = useRef(null);
  const launchTimerRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [bookReady, setBookReady] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  const [focus, setFocus] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const reduceMotion = useReducedMotion();

  const spreadIndex = pageIndexToSpreadIndex(pageIndex);
  const spread = SPREADS[spreadIndex];

  const getBook = useCallback(() => bookRef.current?.pageFlip?.(), []);

  const previous = useCallback(() => {
    getBook()?.flipPrev("top");
  }, [getBook]);

  const next = useCallback(() => {
    getBook()?.flipNext("top");
  }, [getBook]);

  const goTo = useCallback(
    (nextSpreadIndex) => {
      const safeIndex = Math.max(
        0,
        Math.min(SPREADS.length - 1, nextSpreadIndex),
      );
      const targetPage = spreadIndexToPageIndex(safeIndex);

      if (targetPage !== pageIndex) {
        getBook()?.flip(targetPage, "top");
      }
      setIndexOpen(false);
    },
    [getBook, pageIndex],
  );

  const enterFocus = useCallback(() => {
    setBookReady(false);
    setFocus(true);
  }, []);

  const exitFocus = useCallback(async () => {
    if (document.fullscreenElement) await document.exitFullscreen?.();
    setBookReady(false);
    setFocus(false);
  }, []);

  const startReader = useCallback(() => {
    if (launching) return;

    setLaunching(true);
    launchTimerRef.current = window.setTimeout(() => setStarted(true), 680);
  }, [launching]);

  const toggleFullscreen = useCallback(async () => {
    if (document.fullscreenElement) await document.exitFullscreen?.();
    else await document.documentElement.requestFullscreen?.();
  }, []);

  useEffect(
    () => () => {
      if (launchTimerRef.current) window.clearTimeout(launchTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    const syncFullscreen = () =>
      setFullscreen(Boolean(document.fullscreenElement));

    document.addEventListener("fullscreenchange", syncFullscreen);
    return () =>
      document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!started) return;

      if (event.key === "Escape") {
        if (indexOpen) setIndexOpen(false);
        else if (fullscreen) return;
        else if (focus) exitFocus();
        return;
      }

      if (indexOpen) return;

      if (["ArrowLeft", "PageUp"].includes(event.key)) previous();
      if (["ArrowRight", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        next();
      }
      if (event.key.toLowerCase() === "f") {
        if (focus) exitFocus();
        else enterFocus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    enterFocus,
    exitFocus,
    focus,
    fullscreen,
    indexOpen,
    next,
    previous,
    started,
  ]);

  const pageRange = useMemo(
    () =>
      spread.pages
        .map((page) => String(page).padStart(2, "0"))
        .join(" — "),
    [spread],
  );

  if (!started) {
    return (
      <div className={styles.viewer}>
        <div className={styles.ambient} aria-hidden="true" />
        <Intro launching={launching} onStart={startReader} />
      </div>
    );
  }

  return (
    <motion.div
      className={`${styles.viewer} ${focus ? styles.focusMode : ""}`}
      initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.72, ease: [0.16, 1, 0.3, 1] }}
    >
      {!focus && <div className={styles.ambient} aria-hidden="true" />}
      <div className={styles.reader}>
        {!focus && <Navbar active="proposal" />}
        {!focus && (
          <header className={styles.readerHeader}>
            <div>
              <span>
                <BookOpen size={14} /> Proposal viewer
              </span>
              <h1>
                GreenStats
              </h1>
            </div>
            <p>{spread.label}</p>
          </header>
        )}

        <main className={styles.stage} aria-live="polite">
          <button
            type="button"
            className={`${styles.turnButton} ${styles.turnPrevious}`}
            onClick={previous}
            disabled={!bookReady || pageIndex === 0}
            aria-label="Trang trước"
          >
            <ArrowLeft />
          </button>

          <div
            className={`${styles.bookScene} ${
              pageIndex === 0
                ? styles.coverCentered
                : pageIndex === LAST_PAGE_INDEX
                  ? styles.backCentered
                  : ""
            }`}
          >
            <div className={styles.bookGroundShadow} aria-hidden="true" />
            <HTMLFlipBook
              key={focus ? "proposal-focus" : "proposal-reader"}
              ref={bookRef}
              className={styles.flipBook}
              width={focus ? 800 : 520}
              height={focus ? 1132 : 736}
              size="stretch"
              minWidth={250}
              maxWidth={focus ? 800 : 520}
              minHeight={354}
              maxHeight={focus ? 1132 : 736}
              drawShadow
              flippingTime={reduceMotion ? 500 : 950}
              usePortrait
              startZIndex={10}
              startPage={pageIndex}
              autoSize
              maxShadowOpacity={0.55}
              showCover
              mobileScrollSupport
              swipeDistance={30}
              clickEventForward
              useMouseEvents
              renderOnlyPageLengthChange
              onInit={(event) => {
                setPageIndex(event.data.page);
                setBookReady(true);
              }}
              onFlip={(event) => setPageIndex(event.data)}
            >
              {Array.from({ length: PAGE_COUNT }, (_, index) => (
                <ProposalPageSheet key={index + 1} number={index + 1} />
              ))}
            </HTMLFlipBook>
          </div>

          <button
            type="button"
            className={`${styles.turnButton} ${styles.turnNext}`}
            onClick={next}
            disabled={!bookReady || pageIndex === LAST_PAGE_INDEX}
            aria-label="Trang sau"
          >
            <ArrowRight />
          </button>

          {focus && (
            <div className={styles.focusActions}>
              <button
                type="button"
                className={styles.focusControl}
                onClick={toggleFullscreen}
                title={fullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
                aria-label={
                  fullscreen ? "Thoát toàn màn hình" : "Mở toàn màn hình"
                }
              >
                {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                <span>{fullscreen ? "Thu nhỏ" : "Toàn màn hình"}</span>
              </button>
              <button
                type="button"
                className={styles.exitFocus}
                onClick={exitFocus}
                aria-label="Thoát chế độ tập trung"
              >
                <Minimize size={18} />
                <span>Thoát tập trung</span>
              </button>
            </div>
          )}
        </main>

        {!focus && (
          <footer className={styles.toolbar} aria-label="Thanh công cụ proposal">
            <button
              type="button"
              onClick={() => setIndexOpen(true)}
              title="Mục lục"
              aria-label="Mở mục lục"
            >
              <Grid2X2 size={16} />
            </button>
            <button
              type="button"
              onClick={previous}
              disabled={!bookReady || pageIndex === 0}
              title="Trang trước"
              aria-label="Trang trước"
            >
              <ArrowLeft size={16} />
            </button>
            <div className={styles.progress} aria-hidden="true">
              <span style={{ width: `${((pageIndex + 1) / PAGE_COUNT) * 100}%` }} />
            </div>
            <strong>{pageRange}</strong>
            <small>/ {PAGE_COUNT}</small>
            <button
              type="button"
              onClick={next}
              disabled={!bookReady || pageIndex === LAST_PAGE_INDEX}
              title="Trang sau"
              aria-label="Trang sau"
            >
              <ArrowRight size={16} />
            </button>
            <span className={styles.toolbarDivider} aria-hidden="true" />
            <button
              type="button"
              onClick={enterFocus}
              title="Chế độ tập trung"
              aria-label="Bật chế độ tập trung"
            >
              <Focus size={16} />
            </button>
          </footer>
        )}
      </div>

      <AnimatePresence>
        {indexOpen && (
          <motion.div
            className={styles.indexOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.section
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 18, opacity: 0 }}
            >
              <header>
                <div>
                  <small>Document index</small>
                  <h2>Các phần của cuốn sách</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIndexOpen(false)}
                  aria-label="Đóng"
                >
                  <X />
                </button>
              </header>
              <div className={styles.indexGrid}>
                {SPREADS.map((item, index) => (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => goTo(index)}
                    className={index === spreadIndex ? styles.current : ""}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <strong>{item.label}</strong>
                      <small>
                        {item.type === "spread"
                          ? "Hai trang đối diện"
                          : "Một trang độc lập"}
                      </small>
                    </div>
                    <ArrowRight size={14} />
                  </button>
                ))}
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
