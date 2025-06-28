import { useEffect, useRef, useState } from "react";
import axios from "axios";

interface DirectChatProps {
  friendshipID: number | null;
}

interface Message {
  id: number;
  usuario: {
    id: number;
    nombre_usuario: string;
  };
  contenido: string;
}

function DirectChat({ friendshipID }: DirectChatProps) {
  const [message, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
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
  }, [friendshipID]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  const sendMessage = async () => {
    if (!input.trim() || !friendshipID) return;

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/mensajedirecto/${friendshipID}`, {
        contenido: input,
        timestamp: new Date().toISOString()
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessages((prev) => [...prev, response.data]);
      setInput("");
    } catch (err) {
      console.error(err);
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
    <div className="flex flex-col h-full w-full bg-[#f5f5f5]">
      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm h-full pt-12 md:pt-4">
        {message.map((msg) => (
          <div key={msg.id} className="mb-2 text-black">
            <strong>{msg.usuario.nombre_usuario}:</strong> {msg.contenido}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t flex gap-2 sticky bottom-0">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border border-gray-300 p-2 text-black"
        />
        <button
          onClick={sendMessage}
          className="bg-white text-black hover:bg-black hover:text-white px-4 py-2"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default DirectChat;