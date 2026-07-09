import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal";
import WorkCard from "./WorkCard";
import { works, workSections, type WorkSection } from "../data/works";

type ViewMode = "cinema" | "wall";

const sectionOrder: WorkSection[] = ["commercial", "story", "visual"];

export default function WorkBrowser() {
  const [mode, setMode] = useState<ViewMode>("cinema");
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const activeWork = works[activeIndex] ?? works[0];
  const activeSection = activeWork.section;

  const updateActiveFromScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const scrollerRect = scroller.getBoundingClientRect();
    const centerX = scrollerRect.left + scrollerRect.width / 2;
    let nextIndex = activeIndex;
    let minDistance = Number.POSITIVE_INFINITY;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(cardCenter - centerX);
      if (distance < minDistance) {
        minDistance = distance;
        nextIndex = index;
      }
    });

    if (nextIndex !== activeIndex) setActiveIndex(nextIndex);
  };

  useEffect(() => {
    updateActiveFromScroll();
    window.addEventListener("resize", updateActiveFromScroll);
    return () => window.removeEventListener("resize", updateActiveFromScroll);
  }, []);

  const scrollToSection = (section: WorkSection) => {
    const index = works.findIndex((work) => work.section === section);
    cardRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  return (
    <section className="work-browser">
      <div className="work-view-switch">
        <div>
          <span>作品</span>
          <strong>{mode === "cinema" ? "影像展厅" : "作品墙"}</strong>
        </div>
        <div className="view-options" aria-label="浏览方式">
          <button className={mode === "cinema" ? "active" : ""} type="button" onClick={() => setMode("cinema")}>
            影像展厅
          </button>
          <button className={mode === "wall" ? "active" : ""} type="button" onClick={() => setMode("wall")}>
            作品墙
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mode === "cinema" ? (
          <motion.div
            key="cinema"
            className="horizontal-browser"
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(10px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="work-hero-preview">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeWork.slug}
                  className="work-hero-bg"
                  src={activeWork.coverLandscape ?? activeWork.cover}
                  alt=""
                  initial={{ opacity: 0, scale: 1.01, filter: "blur(12px)" }}
                  animate={{ opacity: 1, scale: 1.035, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.015, filter: "blur(12px)" }}
                  transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
                />
              </AnimatePresence>
              <div className="work-hero-shade" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeWork.slug}-copy`}
                  className="work-hero-copy"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.42, ease: "easeOut" }}
                >
                  <span>{activeWork.categoryLabel} / {activeWork.year}</span>
                  <h1>{activeWork.title}</h1>
                  <p>上线平台：{activeWork.platform}</p>
                  <Link to={`/works/${activeWork.slug}`}>查看案例 →</Link>
                </motion.div>
              </AnimatePresence>
            </div>

            <section className="poster-dock" aria-label="作品海报浏览">
              <nav className="work-category-nav" aria-label="作品栏目">
                {sectionOrder.map((section) => {
                  const meta = workSections.find((item) => item.key === section)!;
                  return (
                    <button
                      key={section}
                      className={activeSection === section ? "active" : ""}
                      type="button"
                      onClick={() => scrollToSection(section)}
                    >
                      {meta.title}
                    </button>
                  );
                })}
              </nav>
              <div
                ref={scrollerRef}
                className="horizontal-work-scroller"
                onScroll={updateActiveFromScroll}
                onWheel={(event) => {
                  if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
                    event.currentTarget.scrollLeft += event.deltaY;
                    event.preventDefault();
                  }
                }}
              >
                {works.map((work, index) => (
                  <Link
                    key={work.slug}
                    ref={(node) => {
                      cardRefs.current[index] = node;
                    }}
                    className={`mini-work-card ${activeIndex === index ? "active" : ""}`}
                    to={`/works/${work.slug}`}
                  >
                    <img src={work.coverPortrait ?? work.cover} alt={work.title} loading="lazy" />
                    <span>{work.year}</span>
                    <strong>{work.title}</strong>
                    <small>{work.categoryLabel}</small>
                  </Link>
                ))}
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.section
            key="wall"
            className="portfolio-grid-mode container"
            initial={{ opacity: 0, y: 24, scale: 0.985, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, scale: 0.99, filter: "blur(10px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="portfolio-intro">
              <span>作品墙</span>
              <h1>快速浏览全部作品</h1>
              <p>以更高密度浏览商业视觉、故事内容与视觉探索。</p>
            </div>
            <div className="portfolio-feed">
              {works.map((work, index) => (
                <Reveal key={work.slug} delay={(index % 8) * 0.035}>
                  <WorkCard work={work} />
                </Reveal>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </section>
  );
}
