import { useParams } from "react-router-dom";
import { useEffect, useRef, useState, type PointerEvent, type WheelEvent } from "react";
import PageTransition from "../components/PageTransition";
import { works } from "../data/works";

function DemoVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [poster, setPoster] = useState("");

  useEffect(() => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.src = src;

    const captureFrame = () => {
      const seekTime = Math.min(Math.max(video.duration * 0.18, 0.8), 3.2);
      video.currentTime = Number.isFinite(seekTime) ? seekTime : 1;
    };

    const drawPoster = () => {
      if (!video.videoWidth || !video.videoHeight) return;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setPoster(canvas.toDataURL("image/jpeg", 0.82));
    };

    video.addEventListener("loadedmetadata", captureFrame);
    video.addEventListener("seeked", drawPoster);

    return () => {
      video.removeEventListener("loadedmetadata", captureFrame);
      video.removeEventListener("seeked", drawPoster);
      video.removeAttribute("src");
      video.load();
    };
  }, [src]);

  return <video ref={videoRef} src={src} poster={poster || undefined} controls playsInline preload="metadata" />;
}

export default function CaseStudy() {
  const { slug } = useParams();
  const work = works.find((item) => item.slug === slug) ?? works[0];
  const sceneAssets = work.visualDevelopment?.scenes ?? [];
  const characterAssets = work.visualDevelopment?.characters ?? [];
  const demoVideos = work.videos?.length ? work.videos : work.video ? [work.video] : [];
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const handleGalleryWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.currentTarget.scrollLeft += event.deltaY;
      event.preventDefault();
    }
  };

  const startGalleryDrag = (event: PointerEvent<HTMLDivElement>) => {
    dragState.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: event.currentTarget.scrollLeft,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveGalleryDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    event.currentTarget.scrollLeft = dragState.current.scrollLeft - (event.clientX - dragState.current.startX);
  };

  const endGalleryDrag = () => {
    dragState.current.active = false;
  };

  return (
    <PageTransition>
      <section className="case-hero">
        <img src={work.coverLandscape ?? work.cover} alt={work.title} />
        <a className="case-back-link" href="/works">
          ← 返回作品
        </a>
        <div className="case-hero-copy container">
          <span>{work.categoryLabel}</span>
          <h1>{work.title}</h1>
          <p>上线平台：{work.platform}</p>
        </div>
      </section>

      <section className="case-info container">
        {[
          ["项目名称", work.title],
          ["所属板块", work.categoryLabel],
          ["项目类型", work.projectType],
          ["画风类型", work.visualStyle ?? work.services[1] ?? "AI影像"],
          ["内容题材", work.subject ?? work.projectType],
          ["项目参与", work.participation ?? work.services.join(" / ")],
          ["画幅比例", work.ratio],
          ["合作对象", work.client],
          ["上线平台", work.platform],
          ["国内/海外", work.market ?? (work.platform.includes("TikTok") || work.platform.includes("YouTube") || work.platform.includes("Meta") ? "海外" : "国内")],
        ].map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </section>

      <section className="case-body container">
        {(sceneAssets.length > 0 || characterAssets.length > 0) ? (
          <h2>视觉开发</h2>
        ) : null}

        {sceneAssets.length > 0 ? (
          <article className="visual-development-block">
            <h3>场景</h3>
            <div
              className="visual-strip asset-gallery"
              onWheel={handleGalleryWheel}
              onPointerDown={startGalleryDrag}
              onPointerMove={moveGalleryDrag}
              onPointerUp={endGalleryDrag}
              onPointerCancel={endGalleryDrag}
            >
              {sceneAssets.map((asset, index) => (
                <button key={`${work.slug}-scene-${index}`} type="button" onClick={() => setLightboxImage(asset)}>
                  <img src={asset} alt={`${work.title} 场景 ${index + 1}`} loading="lazy" />
                </button>
              ))}
            </div>
          </article>
        ) : null}

        {characterAssets.length > 0 ? (
          <article className="visual-development-block">
            <h3>人物</h3>
            <div
              className="visual-strip visual-strip-portrait asset-gallery"
              onWheel={handleGalleryWheel}
              onPointerDown={startGalleryDrag}
              onPointerMove={moveGalleryDrag}
              onPointerUp={endGalleryDrag}
              onPointerCancel={endGalleryDrag}
            >
              {characterAssets.map((asset, index) => (
                <button key={`${work.slug}-character-${index}`} type="button" onClick={() => setLightboxImage(asset)}>
                  <img src={asset} alt={`${work.title} 人物 ${index + 1}`} loading="lazy" />
                </button>
              ))}
            </div>
          </article>
        ) : null}

        {demoVideos.length > 0 ? (
          <article className="demo-gallery">
            {demoVideos.map((video) => (
              <div className="film-frame" key={video}>
                <DemoVideo src={video} />
              </div>
            ))}
          </article>
        ) : null}
      </section>
      {lightboxImage ? (
        <button className="lightbox" type="button" onClick={() => setLightboxImage(null)} aria-label="关闭大图">
          <img src={lightboxImage} alt="" />
        </button>
      ) : null}
    </PageTransition>
  );
}
