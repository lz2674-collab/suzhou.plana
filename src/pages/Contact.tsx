import PageTransition from "../components/PageTransition";

const projectTypes = [
  "品牌广告 / TVC",
  "活动影像",
  "竖屏短剧",
  "文旅项目",
  "IP概念片",
  "MV / 演唱会视觉",
  "AI视觉资产",
  "其他",
];

export default function Contact() {
  return (
    <PageTransition>
      <section className="contact-page container">
        <div>
          <span>Contact</span>
          <h1>让我们从一个创意开始。</h1>
          <p>告诉我们项目的目标、周期与想要抵达的观众。PlanA 会从创意、技术路径和可交付影像三个层面回应。</p>
        </div>
        <form className="contact-form">
          <label>
            姓名
            <input type="text" name="name" />
          </label>
          <label>
            公司
            <input type="text" name="company" />
          </label>
          <label>
            项目类型
            <select name="projectType" defaultValue="">
              <option value="" disabled>
                请选择
              </option>
              {projectTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <label>
            预算范围
            <input type="text" name="budget" placeholder="例如 20万 - 50万" />
          </label>
          <label>
            联系方式
            <input type="text" name="contact" placeholder="微信 / 邮箱 / 电话" />
          </label>
          <label className="full">
            项目描述
            <textarea name="description" rows={6} />
          </label>
          <button className="button red" type="button">
            提交咨询
          </button>
        </form>
      </section>
    </PageTransition>
  );
}
