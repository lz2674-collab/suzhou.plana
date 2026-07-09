import PageTransition from "../components/PageTransition";
import { clients, universities } from "../data/clients";

export default function About() {
  return (
    <PageTransition>
      <section className="page-hero container">
        <span>About</span>
        <h1>关于 PlanA</h1>
        <p>
          PlanA 是一家专注于 AI 原生影像生产的创作公司，服务原创IP、品牌广告、活动影像、文旅内容与平台短剧。
          技术不是替代创意，而是放大创意。
        </p>
      </section>
      <section className="about-layout container">
        <article>
          <span>Company</span>
          <h2>公司简介</h2>
          <p>
            我们将导演思维、设计系统与AI影像流程结合，为需要更快验证、更高视觉密度和更多版本输出的商业项目提供完整制作能力。
          </p>
        </article>
        <article>
          <span>Belief</span>
          <h2>核心理念</h2>
          <p>让技术承担重复劳动，让创意获得更大的试错空间和更精确的市场反馈。</p>
        </article>
        <article>
          <span>Team</span>
          <h2>团队能力</h2>
          <p>覆盖创意策划、导演分镜、AI视觉开发、动态设计、剪辑包装、平台投放版本与资产管理。</p>
        </article>
        <article>
          <span>Path</span>
          <h2>发展路径</h2>
          <p>从AI短内容生产出发，持续扩展到品牌广告、IP概念片、舞台视觉和跨平台商业内容。</p>
        </article>
      </section>
      <section className="container about-lists">
        <div>
          <h2>合作平台</h2>
          <p>{clients.join(" / ")}</p>
        </div>
        <div>
          <h2>合作高校</h2>
          <p>{universities.join(" / ")}</p>
        </div>
      </section>
    </PageTransition>
  );
}
