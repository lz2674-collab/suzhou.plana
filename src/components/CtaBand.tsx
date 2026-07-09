import { Link } from "react-router-dom";

export default function CtaBand() {
  return (
    <section className="cta-band container">
      <p>从一个创意开始，到一支可被市场验证的影像作品。</p>
      <Link className="button red" to="/contact">
        发起项目咨询
      </Link>
    </section>
  );
}
