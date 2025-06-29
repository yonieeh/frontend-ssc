import { SocketContext } from "./socketcontext-utils";
import socket from "../socket";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userID = token ? parseInt((jwtDecode(token) as { subject: string }).subject) : null;

    if (!userID) return;
    if (!socket.connected) socket.connect();

    const updateOnlineStatus = () => {
      socket.emit("statusUpdate");
    };

    socket.on("connect", updateOnlineStatus);

    const disconnect = () => socket.disconnect();
    window.addEventListener("beforeunload", disconnect);

    return () => {
      socket.disconnect();
      window.removeEventListener("beforeunload", disconnect);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
