import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  autoConnect: false
});

socket.auth = {
  token: localStorage.getItem("token")
};

export default socket;