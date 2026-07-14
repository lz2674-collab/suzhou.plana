import { type ReactNode, useEffect, useRef, useState } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  desktopWidth?: number;
};

export default function MobileScaledCanvas({ children, className = "", desktopWidth = 1440 }: Props) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>();

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");

    const updateHeight = () => {
      if (!innerRef.current || !media.matches) {
        setHeight(undefined);
        return;
      }

      const scale = window.innerWidth / desktopWidth;
      setHeight(innerRef.current.scrollHeight * scale);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    if (innerRef.current) observer.observe(innerRef.current);

    window.addEventListener("resize", updateHeight);
    media.addEventListener("change", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
      media.removeEventListener("change", updateHeight);
    };
  }, [desktopWidth]);

  return (
    <div
      className={`mobile-scaled-canvas ${className}`.trim()}
      style={{
        "--mobile-canvas-width": `${desktopWidth}px`,
        "--mobile-canvas-scale": `calc(100vw / ${desktopWidth})`,
        height: height ? `${height}px` : undefined,
      } as React.CSSProperties}
    >
      <div ref={innerRef} className="mobile-scaled-canvas-inner">
        {children}
      </div>
    </div>
  );
}
