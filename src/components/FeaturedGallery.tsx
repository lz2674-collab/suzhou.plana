import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import PreviewPanel from "./PreviewPanel";
import WorkScroller from "./WorkScroller";
import { works } from "../data/works";

export default function FeaturedGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const featuredWorks = works;
  const maxShift = Math.max(0, (featuredWorks.length - 3) * 326);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const listY = useTransform(scrollYProgress, [0, 1], [0, -maxShift]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const nextIndex = Math.min(
      featuredWorks.length - 1,
      Math.max(0, Math.round(progress * (featuredWorks.length - 1)))
    );
    setActiveIndex(nextIndex);
  });

  const activeWork = featuredWorks[activeIndex] ?? featuredWorks[0];

  return (
    <section ref={sectionRef} className="featured-gallery" aria-label="精选作品展示">
      <div className="featured-sticky">
        <PreviewPanel work={activeWork} index={activeIndex} />
        <WorkScroller works={featuredWorks} activeIndex={activeIndex} y={listY} />
      </div>
    </section>
  );
}
