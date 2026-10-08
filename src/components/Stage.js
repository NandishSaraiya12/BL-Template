import { useEffect, useState } from "react";

// The layout is designed on a fixed canvas and scaled to fit whatever viewport
// the recorder uses, so it looks identical at 720p, 1080p, etc.
const CANVAS = {
  landscape: { width: 1920, height: 1080 },
  portrait: { width: 1080, height: 1920 },
};

const useViewportSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const onResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return size;
};

export const Stage = ({ orientation, rotate, children }) => {
  const viewport = useViewportSize();
  const { width, height } = CANVAS[orientation];

  // When rotated by 90/270 the canvas occupies the viewport sideways.
  const sideways = Math.abs(rotate) % 180 === 90;
  const scale = Math.min(
    viewport.width / (sideways ? height : width),
    viewport.height / (sideways ? width : height)
  );

  return (
    <div
      className={`stage ${orientation}`}
      style={{
        width,
        height,
        transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${scale})`,
      }}
    >
      {children}
    </div>
  );
};
