import { createContext, useContext, useEffect } from "react";
import socket from "../socket";
import { jwtDecode } from "jwt-decode";

export const SocketContext = createContext(socket);
export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userID = (token) ? parseInt((jwtDecode(token) as { subject: string }).subject) : null;

    if (!userID) return;
    if (!socket.connected) socket.connect();

    const updateOnlineStatus = () => {
      socket.emit("statusUpdate");
    }
    
    socket.on("connect", updateOnlineStatus);

    window.addEventListener("beforeunload", () => { socket.disconnect() });
    
    return () => { 
      socket.disconnect();
      window.removeEventListener("beforeunload", () => { socket.disconnect() }); 
    }
  }, []);
   
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}