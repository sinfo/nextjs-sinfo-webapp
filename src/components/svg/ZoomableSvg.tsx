import React, { useState, useRef, ReactNode, useEffect } from "react";

interface ZoomableWrapperProps {
  children: ReactNode;
  minZoom?: number;
  maxZoom?: number;
  className?: string;
  resetViewButton?: boolean;
}

const ZoomableWrapper: React.FC<ZoomableWrapperProps> = ({
  children,
  minZoom = 0.5,
  maxZoom = 5,
  className = "w-full h-96",
  resetViewButton = false,
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(
        Math.max(scale * scaleFactor, minZoom),
        maxZoom
      );

      // Adjust position to zoom towards cursor
      const dx = x - position.x;
      const dy = y - position.y;
      const newX = position.x - dx * (scaleFactor - 1);
      const newY = position.y - dy * (scaleFactor - 1);

      setScale(newScale);
      setPosition({ x: newX, y: newY });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [scale, position, minZoom, maxZoom]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Left click only
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Optional: Add bounds checking here if needed
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const zoomIn = () => {
    setScale((prevScale) => {
      const newScale = Math.min(prevScale * 1.2, maxZoom);
      return newScale;
    });
  };

  const zoomOut = () => {
    setScale((prevScale) => {
      const newScale = Math.max(prevScale * 0.8, minZoom);
      return newScale;
    });
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full">
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={zoomIn}
          className="button button-primary !bg-sinfo-primary flex-1 p-2 rounded hover:opacity-90 transition-opacity"
        >
          +
        </button>
        <button
          onClick={zoomOut}
          className="button button-primary !bg-sinfo-primary flex-1 p-2 rounded hover:opacity-90 transition-opacity"
        >
          -
        </button>
        {resetViewButton && (
          <button
            onClick={resetView}
            className="button button-primary !bg-sinfo-secondary flex-1 p-2 rounded hover:opacity-90 transition-opacity"
          >
            Reset
          </button>
        )}
      </div>

      {/* SVG Container */}
      <div
        ref={containerRef}
        className={`relative overflow-hidden border border-gray-300 rounded ${className}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className={`
            w-full h-full 
            ${isDragging ? "cursor-grabbing" : "cursor-grab"} 
            origin-top-left 
            transition-transform duration-75
          `}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ZoomableWrapper;
