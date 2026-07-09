import { Link } from "react-router-dom";

const r2 = (path: string) => `https://pub-a713d9cf23ab4d0eadc1394422e1924b.r2.dev${path}`;

export default function Footer() {
  return (
    <footer className="footer">
      <img
        className="footer-bg"
        src={r2("/images/footer-cinema-bg.jpg")}
        alt=""
      />
      <div className="footer-overlay" />
      <div className="footer-center">
        <span>PlanA / 首选计划</span>
        <h2>EXPLORING THE NEXT VISUAL LANGUAGE</h2>
        <p>持续探索 AI 时代的下一种视觉表达。</p>
        <Link className="button red" to="/contact">
          联系合作
        </Link>
      </div>
      <div className="footer-links">
        <span>首选计划 · 影像创作</span>
        <Link to="/works">作品</Link>
        <Link to="/services">服务</Link>
        <Link to="/contact">联系</Link>
      </div>
    </footer>
  );
}
