import { useEffect, useRef, useState } from "react";
import axios from "../config/axiosconfig";
import { useSocket } from "../context/socketcontext-utils";
import "./directchat.css";  

interface DirectChatProps {
  friendshipID: number | null;
  friendName: string;
  friendAvatar: string;
  onBack?: () => void
}

interface Message {
  id: number;
  usuario: {
    id: number;
    nombre_usuario: string;
  };
  contenido: string;
}

function DirectChat({ friendshipID, friendName, friendAvatar, onBack }: DirectChatProps) {
  const socket = useSocket();
  const [message, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!friendshipID) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/mensajedirecto/${friendshipID}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMessages(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [friendshipID, token]);

  useEffect(() => {
    if (friendshipID) {
      socket.emit('joinDM', friendshipID);
    }
  }, [friendshipID, socket]);

  useEffect(() => {
    const handleRecieveMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('DM', handleRecieveMessage);
    return () => {
      socket.off('DM', handleRecieveMessage);
    };

  }, [socket]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  const sendMessage = async () => {
    if (!input.trim() || !friendshipID) return;

    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/mensajedirecto/${friendshipID}`, {
        contenido: input,
        timestamp: new Date().toISOString()
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      socket.emit('DM', {friendshipID, ...response.data});
      setInput("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!friendshipID) {
    return (
      <div className="w-full flex items-center justify-center text-black bg-transparent text-2xl">
        Selecciona a un amigo para empezar una conversación
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f5f5f5] border-t-4 border-black lg:mt-0">
      <div className="w-full bg-white border-b-2 border-black flex items-center gap-2 px-4 py-3 sticky top-0 z-10 shrink-0">
          <button
            onClick={onBack}
            className="md:hidden text-black font-bold font-[Comic_Sans_MS] mr-2"
          >
            ←
          </button>
        <img src={friendAvatar} alt={friendName} className="w-8 h-8 rounded-full" />
        <span className="font-bold text-black text-lg font-[Comic_Sans_MS]">{friendName}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm md:pt-4 md:pl-5">
        {message.map((msg) => (
          <div key={msg.id} className="mb-2 text-black chat-message p font-[Comic_Sans_MS]">
            <strong>{msg.usuario?.nombre_usuario ?? "usuario eliminado"}:</strong> {msg.contenido}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      
      <div className="p-4 border-t flex gap-2 sticky bottom-0 z-0 shrink-0">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border border-gray-300 p-2 text-black bg-white font-[Comic_Sans_MS]"
        />
        {!loading && (
          <button
            onClick={sendMessage}
            className="bg-white text-black hover:bg-black hover:text-white border-2 border-black px-4 py-2 font-[Comic_Sans_MS]"
          >
            Enviar
          </button>
        )}
      </div>
    </div>
  );
}

export default DirectChat;