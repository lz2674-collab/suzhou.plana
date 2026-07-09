import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import PageTransition from "../components/PageTransition";
import SideIndex from "../components/SideIndex";
import WorkSection from "../components/WorkSection";
import Reveal from "../components/Reveal";
import { aiPlaceholderWorks, works, type Work, type WorkSection as WorkSectionType } from "../data/works";
import { stats } from "../data/stats";

const r2 = (path: string) => `https://pub-a713d9cf23ab4d0eadc1394422e1924b.r2.dev${path}`;

function CountValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : value;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView || !target) return;

    let frame = 0;
    const total = 42;
    const timer = window.setInterval(() => {
      frame += 1;
      const progress = 1 - Math.pow(1 - frame / total, 3);
      setCount(Math.round(target * progress));
      if (frame >= total) window.clearInterval(timer);
    }, 18);

    return () => window.clearInterval(timer);
  }, [isInView, target]);

  if (!match) return <span ref={ref}>{value}</span>;

  return (
    <span ref={ref}>
      {count}
      <em>{suffix}</em>
    </span>
  );
}

function fillFeaturedWorks(section: WorkSectionType, minCount = 5): Work[] {
  const realWorks = works.filter((work) => work.featured && work.section === section);
  const placeholders = aiPlaceholderWorks.filter((work) => work.section === section);
  return [...realWorks, ...placeholders].slice(0, Math.max(minCount, realWorks.length));
}

export default function Home() {
  const aboutServices = ["AI视觉营销", "原创IP开发", "商业短片", "活动影像", "内容营销"];
  const aboutExplorations = ["AI 原生内容", "电影级叙事", "原创 IP", "交互体验", "生成式设计", "虚拟制作"];
  const clientLogos = [
    { name: "TikTok", logo: r2("/logos/tiktok.svg") },
    { name: "YouTube", logo: r2("/logos/youtube.svg") },
    { name: "Meta", logo: r2("/logos/meta.png") },
    { name: "Kwai", logo: r2("/logos/kwai.png") },
    { name: "小红书", logo: r2("/logos/xiaohongshu.png") },
    { name: "PMI", logo: r2("/logos/pmi.jpg"), display: "wide" },
    { name: "PineDrama", logo: r2("/logos/pinedrama.png"), display: "iconCompact" },
    { name: "ReelShort", logo: r2("/logos/reelshort.png"), display: "iconCompact" },
    { name: "DramaBox", logo: r2("/logos/dramabox.png"), display: "icon" },
    { name: "红果", logo: r2("/logos/hongguo.png"), display: "iconCompact" },
    { name: "Bilibili", logo: r2("/logos/bilibili.svg") },
    { name: "爱奇艺", logo: r2("/logos/iqiyi.png"), display: "large" },
    { name: "Tencent", logo: r2("/logos/tencent-display.png"), display: "xlarge" },
    { name: "DramaWave", logo: r2("/logos/dramawave.png"), display: "icon" },
  ];
  const indexItems = [
    { id: "commercial", label: "商业视觉", description: "品牌广告、活动影像、文旅宣传与商业 Campaign。" },
    { id: "story", label: "故事内容", description: "竖屏短剧、连续叙事、剧情广告与IP故事开发。" },
    { id: "visual", label: "视觉探索", description: "概念影像、风格帧、世界观设计与动态测试。" },
  ];

  return (
    <PageTransition>
      <section className="hero">
        <motion.video
          className="hero-bg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={r2("/videos/hero.mov")} type="video/mp4" />
          <source src={r2("/videos/hero.mov")} type="video/quicktime" />
        </motion.video>
        <div className="hero-wash" />
        <img className="hero-typography" src={r2("/brand/plana-red-typography.png")} alt="" aria-hidden="true" />
        <div className="hero-content container">
          <div className="hero-copy">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              <p className="hero-kicker">AI 原生影像创作公司</p>
              <h1>重新定义商业影像的生产方式。</h1>
              <p className="hero-label">
                用 AI 与电影语言，为品牌、IP、活动和内容平台打造具有传播力的影像作品。
              </p>
              <div className="hero-actions">
                <Link className="button light-primary" to="/works">
                  观看作品
                </Link>
                <Link className="button light-ghost" to="/contact">
                  发起咨询
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <motion.section
        className="works-showcase"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="works-showcase-layout container">
          <motion.div
            className="works-index"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.72, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <SideIndex items={indexItems} />
          </motion.div>
          <motion.div
            className="works-stage"
            initial={{ opacity: 0, y: 42 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.82, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <Reveal>
              <WorkSection section="commercial" works={fillFeaturedWorks("commercial")} />
            </Reveal>
            <Reveal>
              <WorkSection section="story" works={fillFeaturedWorks("story")} />
            </Reveal>
            <Reveal>
              <WorkSection section="visual" works={fillFeaturedWorks("visual")} />
            </Reveal>
          </motion.div>
        </div>
      </motion.section>

      <section className="company-band">
        <div className="about-editorial container">
          <section className="about-collage-section">
            <div className="about-gallery-wall" aria-hidden="true" />

            <Reveal className="about-floating-card">
              <div className="about-statement">
                <span>关于首选计划</span>
                <h2>重新定义 AI 时代的商业影像。</h2>
                <p>
                  PlanA 是一家以影像审美为核心的 AI Creative Studio。我们相信，AI 不应该替代创意，而应该释放创意。我们持续探索 AI × Film × Design × Interactive 的边界，让每一次先锋尝试，都成为商业价值的一部分。
                </p>
              </div>
              <div className="about-card-lower">
                <div className="about-services">
                  <span>服务精选</span>
                  {aboutServices.map((service) => (
                    <strong key={service}>{service}</strong>
                  ))}
                </div>
                <div className="about-explorations">
                  <span>探索方向</span>
                  {aboutExplorations.map((item) => (
                    <strong key={item}>{item}</strong>
                  ))}
                </div>
                <div className="about-belief">
                  <span>品牌理念</span>
                  <p>
                    我们相信，真正有价值的商业影像，<br />
                    来自审美，而不是模板。
                  </p>
                  <Link className="button ink" to="/contact">
                    开始合作 →
                  </Link>
                </div>
              </div>
            </Reveal>
          </section>

          <Reveal className="about-data">
            {stats.map((item) => (
              <div key={item.label}>
                <strong>
                  <CountValue value={item.value} />
                </strong>
                <span>{item.label}</span>
              </div>
            ))}
          </Reveal>

          <Reveal className="about-clients">
            <div className="about-clients-heading">
              <span>合作平台与客户</span>
              <p>与品牌、平台和内容团队共同完成可被市场验证的影像表达。</p>
            </div>
            <div className="about-client-grid">
              {clientLogos.map((client) => (
                <div key={client.name} className="about-client-box">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className={
                      client.display === "icon"
                        ? "is-icon-logo"
                        : client.display === "wide"
                          ? "is-wide-logo"
                          : client.display === "large"
                            ? "is-large-logo"
                            : client.display === "xlarge"
                              ? "is-xlarge-logo"
                              : client.display === "iconCompact"
                            ? "is-icon-logo is-icon-logo-compact"
                          : undefined
                    }
                    onError={(event) => {
                      event.currentTarget.hidden = true;
                    }}
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
