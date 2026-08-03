"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, BookOpen, Expand, Grid2X2, Leaf, Minimize, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Navbar from "@/components/Navbar";
import styles from "./proposal.module.css";

const SPREADS = [
  { label: "Bìa trước", pages: [1], type: "cover" },
  ...Array.from({ length: 8 }, (_, index) => ({ label: `Trang ${index * 2 + 2}–${index * 2 + 3}`, pages: [index * 2 + 2, index * 2 + 3], type: "spread" })),
  { label: "Bìa sau", pages: [18], type: "back" },
];


function BlankPage({ number, side, type, quiet = false }) {
  return <article className={`${styles.paper} ${styles[side]} ${styles[type]}`} aria-label={`Trang ${number}`}>
    <div className={styles.paperTexture} aria-hidden="true" />
    {!quiet && <><span className={styles.paperBrand}><Leaf size={12} /> GreenStats</span><span className={styles.paperGhost}>{String(number).padStart(2, "0")}</span><div className={styles.paperCaption}><small>Research proposal</small><strong>Trang {String(number).padStart(2, "0")}</strong><p>Nội dung mẫu sẽ được thay bằng proposal chính thức.</p></div><span className={styles.folio}>{number}</span></>}
  </article>;
}

function Intro({ onStart }) {
  return <motion.div className={styles.intro} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .5 }}>
    <Navbar active="proposal" />
    <header className={styles.hero}>
      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .85, ease: [.16, 1, .3, 1] }}>
        <span className={styles.eyebrow}><BookOpen size={15} /> Research proposal · 18 trang A4</span>
        <h1>Một ý tưởng.<br /><em>Mười tám trang.</em></h1>
        <p>Không gian trình chiếu proposal GreenStats được kể như một cuốn sách — tĩnh lặng, tập trung và giàu chiều sâu.</p>
        <button onClick={onStart} className={styles.start}>Mở cuốn sách <ArrowDown size={17} /></button>
      </motion.div>
      <motion.div className={styles.heroBook} initial={{ opacity: 0, rotate: 9, y: 30 }} animate={{ opacity: 1, rotate: 5, y: 0 }} transition={{ duration: 1, delay: .18, ease: [.16, 1, .3, 1] }} aria-hidden="true"><span>18</span><small>pages · A4</small></motion.div>
    </header>
  </motion.div>;
}

export default function ProposalPage() {
  const [started, setStarted] = useState(false);
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [turnToken, setTurnToken] = useState(0);
  const [indexOpen, setIndexOpen] = useState(false);
  const [focus, setFocus] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const reduceMotion = useReducedMotion();
  const spread = SPREADS[spreadIndex];

  const goTo = useCallback((nextIndex) => {
    const safe = Math.max(0, Math.min(SPREADS.length - 1, nextIndex));
    if (safe === spreadIndex) return;
    setDirection(safe > spreadIndex ? 1 : -1);
    setSpreadIndex(safe);
    setTurnToken(token => token + 1);
    setIndexOpen(false);
  }, [spreadIndex]);
  const previous = useCallback(() => goTo(spreadIndex - 1), [goTo, spreadIndex]);
  const next = useCallback(() => goTo(spreadIndex + 1), [goTo, spreadIndex]);

  useEffect(() => {
    const onKeyDown = event => {
      if (!started) return;
      if (event.key === "Escape") { setIndexOpen(false); setFocus(false); }
      if (["ArrowLeft", "PageUp"].includes(event.key)) previous();
      if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); next(); }
      if (event.key.toLowerCase() === "f") setFocus(value => !value);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, previous, started]);

  useEffect(() => {
    const sync = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const pageRange = useMemo(() => spread.pages.map(page => String(page).padStart(2, "0")).join(" — "), [spread]);
  const toggleFullscreen = async () => document.fullscreenElement ? document.exitFullscreen?.() : document.documentElement.requestFullscreen?.();

  if (!started) return <div className={styles.viewer}><div className={styles.ambient} aria-hidden="true" /><Intro onStart={() => setStarted(true)} /></div>;

  return <div className={`${styles.viewer} ${focus ? styles.focusMode : ""}`}>
    {!focus && <div className={styles.ambient} aria-hidden="true" />}
    <div className={styles.reader}>
      {!focus && <Navbar active="proposal" />}
      {!focus && <header className={styles.readerHeader}><div><span><BookOpen size={14} /> Proposal viewer</span><h1>GreenStats <em>— 18 trang A4</em></h1></div><p>{spread.label}</p></header>}
      <main className={styles.stage} aria-live="polite">
        <button className={`${styles.turnButton} ${styles.turnPrevious}`} onClick={previous} disabled={spreadIndex === 0} aria-label="Trang trước"><ArrowLeft /></button>
        <div className={styles.bookScene}>
          {!focus && <div className={`${styles.bookShadow} ${spread.type === "spread" ? styles.wideShadow : ""}`} aria-hidden="true" />}
          <section className={`${styles.book} ${styles[spread.type]}`} onDoubleClick={() => setFocus(true)} aria-label={`${spread.label}. Nhấp đúp để phóng to.`}>
            {spread.pages.map((number, index) => <BlankPage key={number} number={number} side={spread.pages.length === 1 ? "single" : index === 0 ? "leftPage" : "rightPage"} type={spread.type} />)}
            <AnimatePresence>{turnToken > 0 && !reduceMotion && <motion.div key={turnToken} className={[styles.turningSheet, direction > 0 ? styles.turnForward : styles.turnBackward].join(" ")} initial={{ rotateY: 0 }} animate={{ rotateY: direction > 0 ? -180 : 180 }} exit={{ opacity: 0 }} transition={{ duration: .9, ease: [.42, .03, .2, 1] }}>
              <div className={[styles.turnSide, styles.turnFront].join(" ")}><BlankPage number={direction > 0 ? Math.max(1, spread.pages[0] - 1) : Math.min(18, spread.pages.at(-1) + 1)} side="turnFace" type="spread" quiet /></div>
              <div className={[styles.turnSide, styles.turnBack].join(" ")}><BlankPage number={direction > 0 ? spread.pages[0] : spread.pages.at(-1)} side="turnFace" type="spread" quiet /></div>
            </motion.div>}</AnimatePresence>
            <span className={styles.pageBlock} aria-hidden="true" />
          </section>
        </div>
        <button className={`${styles.turnButton} ${styles.turnNext}`} onClick={next} disabled={spreadIndex === SPREADS.length - 1} aria-label="Trang sau"><ArrowRight /></button>
        {!focus && <button className={styles.zoomButton} onClick={() => setFocus(true)} aria-label="Phóng to cuốn sách"><Expand size={16} /><span>Phóng to</span></button>}
        {focus && <button className={styles.exitFocus} onClick={() => setFocus(false)} aria-label="Thu nhỏ"><Minimize size={18} /><span>Thoát chế độ tập trung</span></button>}
      </main>
      {!focus && <footer className={styles.toolbar}><button onClick={() => setIndexOpen(true)} title="Mục lục"><Grid2X2 size={16} /></button><button onClick={previous} disabled={spreadIndex === 0} title="Trang trước"><ArrowLeft size={16} /></button><div className={styles.progress}><span style={{ width: `${((spreadIndex + 1) / SPREADS.length) * 100}%` }} /></div><strong>{pageRange}</strong><small>/ 18</small><button onClick={next} disabled={spreadIndex === SPREADS.length - 1} title="Trang sau"><ArrowRight size={16} /></button><button onClick={toggleFullscreen} title="Toàn màn hình">{fullscreen ? <Minimize size={16} /> : <Expand size={16} />}</button></footer>}
    </div>
    <AnimatePresence>{indexOpen && <motion.div className={styles.indexOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.section initial={{ y: 24, opacity: 0, scale: .98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 18, opacity: 0 }}><header><div><small>Document index</small><h2>Các phần của cuốn sách</h2></div><button onClick={() => setIndexOpen(false)} aria-label="Đóng"><X /></button></header><div className={styles.indexGrid}>{SPREADS.map((item, index) => <button key={item.label} onClick={() => goTo(index)} className={index === spreadIndex ? styles.current : ""}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.label}</strong><small>{item.type === "spread" ? "Hai trang đối diện" : "Một trang độc lập"}</small></div><ArrowRight size={14} /></button>)}</div></motion.section></motion.div>}</AnimatePresence>
  </div>;
}
