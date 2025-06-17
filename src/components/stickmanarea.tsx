import React, { useState, useEffect, useRef } from "react";
import stickman from "../assets/control-stickman.png";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL);

type User = {
  id: number;
  x: number; 
  y: number;
};

function Stickmanarea() {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [users, setUsers] = useState<Record<string, User>>({});
  const [position, setPosition] = useState({ x: containerSize.width / 2, y: containerSize.height / 2 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const stickmanWidth = containerSize.width * 0.08;
  const stickmanHeight = containerSize.height * 0.08;
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    socket.on('existingUsers', (users: User[]) => {
      const userMap: Record<string, User> = {};
      users.forEach((user) => {
        userMap[user.id] = user;
      });
      setUsers(userMap);
    });

    socket.on('newUser', (user: User) => {
      setUsers((prev) => ({ ...prev, [user.id]: user }));
    });

    socket.on('userMoved', (user: User) => {
      setUsers((prev) => ({ ...prev, [user.id]: user }));
    });

    socket.on('userLeft', (id: number) => {
      setUsers((prev) => {
        const newUsers = { ...prev };
        delete newUsers[id];
        return newUsers;
      });
    })

    return () => {
      socket.off('existingUsers');
      socket.off('newUser');
      socket.off('userMoved');
      socket.off('userLeft');
    };
  }, []);

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
  

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus()
    }
  }, [])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const movementSpeed = 0.02;
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

    const stickmanRatioX = stickmanWidth / containerSize.width;
    const stickmanRatioY = stickmanHeight / containerSize.height;

    newX = Math.max(0, Math.min(newX, 1 - stickmanRatioX));
    newY = Math.max(0, Math.min(newY, 1 - stickmanRatioY));


    setPosition({ x: newX, y: newY});
    socket.emit('userMoved', { 
      x: newX, 
      y: newY
    });
  };

  const move = (dir: 'up' | 'down' | 'left' | 'right') => {
    const speed = 0.02;
    let newX = position.x;
    let newY = position.y;

    if (dir === 'up') newY -= speed;
    if (dir === 'down') newY += speed;
    if (dir === 'left') newX -= speed;
    if (dir === 'right') newX += speed;

    const stickmanRatioX = stickmanWidth / containerSize.width;
    const stickmanRatioY = stickmanHeight / containerSize.height;

    newX = Math.max(0, Math.min(newX, 1 - stickmanRatioX));
    newY = Math.max(0, Math.min(newY, 1 - stickmanRatioY));

    setPosition({ x: newX, y: newY });
    socket.emit('userMoved', { x: newX, y: newY });
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="flex-1 h-full w-full bg-[#e5e5e5] border-3 border-[#1a1a1a] flex items-center justify-center relative overflow-hidden focus:outline-none focus:ring-3 focus:ring-blue-500"
    >
      {isMobile && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <button onClick={() => move('up')} className="bg-gray-300 p-2 rounded">⬆️</button>
          <div className="flex gap-2">
            <button onClick={() => move('left')} className="bg-gray-300 p-2 rounded">⬅️</button>
            <button onClick={() => move('down')} className="bg-gray-300 p-2 rounded">⬇️</button>
            <button onClick={() => move('right')} className="bg-gray-300 p-2 rounded">➡️</button>
          </div>
        </div>
      )}
      <div
        className="absolute transition-transform duration-150 ease-out"
        style={{ 
          left: position.x * (containerSize.width), 
          top: position.y * (containerSize.height),
          width: stickmanWidth,
          height: stickmanHeight
        }}
      >
        <img src={stickman} alt="User stickman" className="w-full h-full" />
      </div>

      {Object.entries(users).map(([id, { x, y }]) => (
        <div
          key={id}
          className="absolute transition-transform duration-150 ease-out"
          style={{ 
            left: x * (containerSize.width), 
            top: y * (containerSize.height),
            width: stickmanWidth,
            height: stickmanHeight
          }}
        >
          <img src={stickman} alt="Other stickman" className="w-full h-full" />
        </div>
      ))}
    </div>
  )
}

export default Stickmanarea