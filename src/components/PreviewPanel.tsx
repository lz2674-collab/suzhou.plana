import { Link } from "react-router-dom";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import type { Work } from "../data/works";

type Props = {
  work: Work;
  index: number;
};

export default function PreviewPanel({ work, index }: Props) {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const x = useTransform(mouseX, [0, 1], [-16, 16]);
  const y = useTransform(mouseY, [0, 1], [-12, 12]);

  return (
    <div
      className="preview-panel"
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        mouseX.set((event.clientX - bounds.left) / bounds.width);
        mouseY.set((event.clientY - bounds.top) / bounds.height);
      }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={work.slug}
          className="preview-image"
          src={work.cover}
          alt={work.title}
          style={{ x, y }}
          initial={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1.08, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>
      <div className="preview-vignette" />
      <AnimatePresence mode="wait">
        <motion.div
          key={`${work.slug}-copy`}
          className="preview-copy"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.36, ease: "easeOut" }}
        >
          <span>{String(index + 1).padStart(2, "0")} / {work.categoryLabel}</span>
          <h2>{work.title}</h2>
          <p>{work.description}</p>
          <Link to={`/works/${work.slug}`}>查看案例 →</Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
