import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import stickman from "../assets/control-stickman.png";
import { useSocket } from "../context/socketcontext";
import { jwtDecode } from "jwt-decode";

type User = {
  id: number;
  x: number; 
  y: number;
  url: string;
  width?: number;
  height?: number;
};

function Stickmanarea() {
  const socket = useSocket();
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [users, setUsers] = useState<Record<string, User>>({});
  const [position, setPosition] = useState({ x: containerSize.width / 2, y: containerSize.height / 2 });
  const [myAvatar, setMyAvatar] = useState<string | null>(null);
  const [avatarSize, setAvatarSize] = useState({ width: 0, height: 0 });
  const [avatarSizes, setAvatarSizes] = useState<Record<string, { width: number; height: number }>>({});
  const { roomID } = useParams();
  const userID = (jwtDecode(localStorage.getItem("token") || "") as { subject: string })?.subject;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = window.innerWidth < 768;

  const maxScale = 0.1;

  const widthRatio = containerSize.width * maxScale / (avatarSize.width || 1);
  const heightRatio = containerSize.height * maxScale / (avatarSize.height || 1);
  const scale = Math.min(widthRatio, heightRatio);

  const stickmanWidth = avatarSize.width ? avatarSize.width * scale : containerSize.width * 0.08;
  const stickmanHeight = avatarSize.height ? avatarSize.height * scale : containerSize.height * 0.08;

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/usuarios`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setMyAvatar(data.avatar);

        const img = new Image();
        img.src = data.avatar;
        img.onload = () => {
          setAvatarSize({ 
            width: img.naturalWidth, 
            height: img.naturalHeight 
          });
        };
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };

    fetchAvatar();
  }, []);

  useEffect(() => {
    const preloadAvatars = async () => {
      const promises = Object.entries(users).map(([id, user]) => {
        return new Promise<void>((resolve) => {
          if (!user.url) return resolve();
          const img = new Image();
          img.src = user.url;
          img.onload = () => {
            setAvatarSizes((prev) => ({
              ...prev,
              [id]: {
                width: img.naturalWidth,
                height: img.naturalHeight
              }
            }));
            resolve()
          };
          
          img.onerror = () => {
            resolve();
          }
        });
      })

      await Promise.all(promises);
    }

    preloadAvatars();
  }, [users])

  useEffect(() => {
    if (!roomID) return;
    socket.emit('joinRoom', roomID);
  }, [roomID])

  useEffect(() => {
    socket.on('existingUsers', (users: User[]) => {
      const userMap: Record<string, User> = {};
      users.forEach((user) => {
        userMap[String(user.id)] = user;
        console.log(user);
      });
      setUsers(userMap);
    });

    socket.on('newUser', (user: User) => {
      setUsers((prev) => ({ ...prev, [String(user.id)]: user }));
    });

    socket.on('userMoved', (user: User) => {
      setUsers((prev) => ({ ...prev, [String(user.id)]: user }));
    });

    socket.on('userLeft', (id: number) => {
      setUsers((prev) => {
        const newUsers = { ...prev };
        delete newUsers[String(id)];
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
      roomID,
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
    socket.emit('userMoved', { roomID, x: newX, y: newY });
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
      {myAvatar && (
        <div
          className="absolute transition-transform duration-150 ease-out"
          style={{ 
            left: position.x * (containerSize.width), 
            top: position.y * (containerSize.height),
            width: stickmanWidth,
            height: stickmanHeight
          }}
          >
          <img src={myAvatar || stickman} alt="User stickman" className="w-full h-full" />
        </div>
      )}

      {Object.entries(users)
        .filter(([id]) => id !== userID)
        .map(([id, { x, y, url }]) => {
          const size = avatarSizes[id];
          if (!size) return null;
          const userScale = Math.min(
            containerSize.width * maxScale / (size.width || 1),
            containerSize.height * maxScale / (size.height || 1)
          )

          const w = size.width * userScale;
          const h = size.height * userScale;

          return (
            <div
              key={id}
              className="absolute transition-transform duration-150 ease-out"
              style={{ 
                left: x * (containerSize.width), 
                top: y * (containerSize.height),
                width: w,
                height: h
              }}
            >
              <img src={url || stickman} alt="Other stickman" className="w-full h-full" />
            </div>
      )})}
    </div>
  )
}

export default Stickmanarea