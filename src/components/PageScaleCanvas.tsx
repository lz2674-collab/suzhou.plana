import { type ReactNode, useEffect, useRef, useState } from "react";

const DESKTOP_CANVAS_WIDTH = 1920;
const MOBILE_QUERY = "(max-width: 767px)";

type Props = {
  children: ReactNode;
};

export { DESKTOP_CANVAS_WIDTH };

export default function PageScaleCanvas({ children }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [mobileLayout, setMobileLayout] = useState<{ scaledHeight: number; scale: number }>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mediaQuery = window.matchMedia(MOBILE_QUERY);

    const updateCanvasHeight = () => {
      if (!mediaQuery.matches) {
        setMobileLayout(undefined);
        return;
      }

      const scale = window.innerWidth / DESKTOP_CANVAS_WIDTH;
      setMobileLayout({ scaledHeight: canvas.scrollHeight * scale, scale });
    };

    const resizeObserver = new ResizeObserver(updateCanvasHeight);
    resizeObserver.observe(canvas);

    updateCanvasHeight();
    window.addEventListener("resize", updateCanvasHeight);
    mediaQuery.addEventListener("change", updateCanvasHeight);
    document.fonts?.ready.then(updateCanvasHeight).catch(() => undefined);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateCanvasHeight);
      mediaQuery.removeEventListener("change", updateCanvasHeight);
    };
  }, []);

  return (
    <div
      className="page-scale-wrapper"
      style={
        mobileLayout
          ? ({
              "--scaled-page-height": `${mobileLayout.scaledHeight}px`,
              "--page-scale": mobileLayout.scale,
            } as React.CSSProperties)
          : undefined
      }
    >
      <div ref={canvasRef} className="desktop-canvas">
        {children}
      </div>
    </div>
  );
}
