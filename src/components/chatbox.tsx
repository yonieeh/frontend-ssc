import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL);


function Chatbox() {
  const [chatMessages, setChatMessages] = useState<
    { id: number; usuario: { nombre_usuario: string }; contenido: string; }[]
  >([]);
  const [input, setInput] = useState("");
  const { idSala } = useParams();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket.on('chatMessage', (message) => {
      setChatMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('chatMessage');
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/mensajes/${idSala}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const messages = response.data;
        setChatMessages(messages);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    fetchChatMessages();
  }, [idSala]);

  const sendMessage = async () => {
    if (input.trim() !== "") {
      const token = localStorage.getItem("token");
      const message = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/mensajes/${idSala}`, {
          contenido: input,
          timestamp: new Date().toISOString(),
          estado: "Enviado"
        }, {
          headers: {
            Authorization: `Bearer ${token}`
        }
      });
      const newMessage = message.data;
      socket.emit("chatMessage", newMessage);
      setInput("");
    }
  };

  
  return (
    <div className="w-full min-w-[280px] bg-[#f5f5f5] border-3 border-[#2a2a2a] flex flex-col p-4 h-full">
      <div className="flex-1 overflow-y-auto bg-[#f0f0f0] p-2 space-y-2 text-sm font-[Comic_Sans_MS] text-[#1a1a1a]">
        {chatMessages.map((message, index) => (
          <div key={index}>
            <strong>{message.usuario.nombre_usuario}:</strong> {message.contenido}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 w-full">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="mt-4 p-2 border border-gray-300 font-[Comic_Sans_MS] shadow-sm focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#2a2a2a] text-[#1a1a1a] w-[70%]"
          placeholder="Escribe tu mensaje..."
        />
        <button
          onClick={sendMessage}
          className="mt-4 p-2 border border-gray-300 font-[Comic_Sans_MS] focus:outline-none focus:ring-2 focus:ring-[#2a2a2a] text-[#1a1a1a] w-[30%]"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

export default Chatbox;