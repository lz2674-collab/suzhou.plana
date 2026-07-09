import PageTransition from "../components/PageTransition";
import CtaBand from "../components/CtaBand";
import { services } from "../data/services";

export default function Services() {
  return (
    <PageTransition>
      <section className="page-hero container">
        <span>Services</span>
        <h1>我们的制作能力</h1>
        <p>从商业广告到短剧开发，从活动开场到演唱会视觉，PlanA 以AI原生流程完成从概念到成片的影像生产。</p>
      </section>
      <section className="services-grid container">
        {services.map((service, index) => (
          <article className="service-card" key={service.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
            <div>
              {service.items.map((item) => (
                <small key={item}>{item}</small>
              ))}
            </div>
          </article>
        ))}
      </section>
      <CtaBand />
    </PageTransition>
  );
}
