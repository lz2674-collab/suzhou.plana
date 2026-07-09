import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Work } from "../data/works";

type Props = {
  work: Work;
  featured?: boolean;
  summaryMode?: "description" | "platform";
};

const fallbackCover =
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=82";
const r2 = (path: string) => `https://pub-a713d9cf23ab4d0eadc1394422e1924b.r2.dev${path}`;

export default function WorkCard({ work, featured = false, summaryMode = "description" }: Props) {
  const coverSrc = work.ratio === "9:16" ? work.coverPortrait ?? work.cover : work.coverLandscape ?? work.cover;
  const isPlaceholder = work.title === "COMING SOON" || work.projectType === "..." || work.projectType === "AI占位作品" || work.slug.includes("placeholder");
  const content = (
    <>
      {isPlaceholder ? (
        <img className="placeholder-cover" src={r2("/images/coming-soon-placeholder.png")} alt="" loading="lazy" aria-hidden="true" />
      ) : (
        <img
          src={coverSrc || fallbackCover}
          alt={work.title}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = fallbackCover;
          }}
        />
      )}
      <div className="scanline" />
      {!isPlaceholder ? (
        <div className="play-state">
          <span />
          <em>预览</em>
        </div>
      ) : null}
      <div className="card-copy">
        <div className="card-meta">
          <span>{isPlaceholder ? "..." : work.categoryLabel}</span>
          <span>{isPlaceholder ? "..." : work.year}</span>
          <span>{isPlaceholder ? "..." : work.ratio}</span>
        </div>
        <h3>{isPlaceholder ? "COMING SOON" : work.title}</h3>
        <p>{isPlaceholder ? "..." : summaryMode === "platform" ? `上线平台：${work.platform}` : work.description}</p>
      </div>
    </>
  );

  return (
    <motion.article
      className={`work-card ratio-${work.ratio.replace(":", "-")} ${work.ratio === "9:16" ? "vertical" : "horizontal"} ${work.size} ${
        featured ? "featured" : ""
      } ${isPlaceholder ? "is-placeholder" : ""}`}
      whileHover={isPlaceholder ? undefined : { y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {isPlaceholder ? (
        <div aria-label="COMING SOON">{content}</div>
      ) : (
        <Link to={`/works/${work.slug}`} aria-label={`查看 ${work.title} 案例`}>
          {content}
        </Link>
      )}
    </motion.article>
  );
}
