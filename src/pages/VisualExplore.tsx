import PageTransition from "../components/PageTransition";
import WorkCard from "../components/WorkCard";
import { visualExploreItems } from "../data/visuals";

export default function VisualExplore() {
  return (
    <PageTransition>
      <section className="page-hero container visual-hero">
        <span>Visual Exploration</span>
        <h1>视觉探索</h1>
        <p>我们持续测试AI影像的边界，从风格、角色、场景到动态叙事流程。</p>
      </section>
      <section className="moodboard container">
        {visualExploreItems.map((item) => (
          <div className="moodboard-item" key={`${item.slug}-${item.label}`}>
            <WorkCard work={item} />
            <span>{item.label}</span>
          </div>
        ))}
      </section>
    </PageTransition>
  );
}
