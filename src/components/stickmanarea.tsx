import React, { useState, useEffect, useRef } from "react";
import stickman from "../assets/control-stickman.png";

function Stickmanarea() {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const stickman_size = 80;

  useEffect(() => {
    const updateSize = () => {
      setContainerSize({
        width: containerRef.current?.offsetWidth ?? 0,
        height: containerRef.current?.offsetHeight ?? 0,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus()
    }
  }, [])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const movementSpeed = 10;
    let newX = position.x;
    let newY = position.y;

    switch (event.key) {
      case 'w':
        newY -= movementSpeed;
        break;
      case 's':
        newY += movementSpeed;
        break;
      case 'a':
        newX -= movementSpeed;
        break;
      case 'd':
        newX += movementSpeed;
        break;
      default:
        break;
    }

    newX = Math.max(0, Math.min(newX, containerSize.width - stickman_size));
    newY = Math.max(0, Math.min(newY, containerSize.height - stickman_size));

    setPosition({ x: newX, y: newY });
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="flex-1 h-full bg-[#e5e5e5] border-3 border-[#1a1a1a] flex items-center justify-center relative overflow-hidden focus:outline-none focus:ring-3 focus:ring-blue-500"
    >
      <div
        className="absolute"
        style={{
          top: position.y,
          left: position.x
        }}
      >
        <img src={stickman} alt="Stickman" className="w-20 h-20" />
      </div>
    </div>
  )
}

export default Stickmanarea