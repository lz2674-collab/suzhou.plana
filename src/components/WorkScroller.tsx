import { motion, type MotionValue } from "framer-motion";
import type { Work } from "../data/works";

type Props = {
  works: Work[];
  activeIndex: number;
  y: MotionValue<number>;
};

export default function WorkScroller({ works, activeIndex, y }: Props) {
  return (
    <div className="work-scroller" aria-label="精选作品列表">
      <motion.div className="work-scroller-track" style={{ y }}>
        {works.map((work, index) => (
        <article
          key={work.slug}
          className={activeIndex === index ? "active" : ""}
        >
          <img src={work.cover} alt={work.title} loading="lazy" />
          <span>{work.year}</span>
          <strong>{work.title}</strong>
          <small>{work.categoryLabel}</small>
        </article>
        ))}
      </motion.div>
    </div>
  );
}
