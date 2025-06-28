import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/socketcontext";


function Chatbox() {
  const socket = useSocket();
  const [chatMessages, setChatMessages] = useState<
    { id: number; usuario: { id: number; nombre_usuario: string }; contenido: string; }[]
  >([]);
  const [input, setInput] = useState("");
  const { roomID } = useParams();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [selectedUser, setSelectedUser] = useState<{ id: number; nombre_usuario: string }>({ id: 0, nombre_usuario: "" });
  const [showFriendModal, setShowFriendModal] = useState(false);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!roomID) return;
    socket.emit('joinRoom', roomID);
  }, [roomID])

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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/mensajes/${roomID}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("URL de backend:", import.meta.env.VITE_BACKEND_URL);
        const messages = response.data;
        console.log("Messages from backend:", messages);
        setChatMessages(messages);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    fetchChatMessages();
  }, [roomID]);

  const sendMessage = async () => {
    if (input.trim() !== "") {
      const token = localStorage.getItem("token");
      const message = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/mensajes/${roomID}`, {
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
    <div className="w-full min-w-[280px] bg-[#f5f5f5] border-3 border-[#2a2a2a] flex flex-col h-full">
      <div className="flex-1 overflow-y-auto bg-[#f0f0f0] p-6 space-y-2 text-sm font-[Comic_Sans_MS] text-[#1a1a1a]">
        {chatMessages.map((message, index) => (
          <div key={index} className="chat-message">
            <strong
              className="cursor-pointer hover:text-[#2a2a2a] hover:font-bold"
              onClick={() => {
                setSelectedUser({id: message.usuario.id, nombre_usuario: message.usuario.nombre_usuario});
                setShowFriendModal(true);
                setRequestStatus(null);
              }}
            >
              {message.usuario.nombre_usuario}
            </strong>: {message.contenido}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 w-full p-4">
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
      {showFriendModal && selectedUser && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4 text-black">Enviar solicitud de amistad</h2>
            <p className="mb-4 text-black">¿Enviar solicitud a <strong>{selectedUser.nombre_usuario}</strong>?</p>
            {requestStatus && (
              <p className="text-sm mb-2 text-center text-gray-600">{requestStatus}</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowFriendModal(false);
                  setSelectedUser({id: 0, nombre_usuario: ""});
                }}
                className="px-4 py-2 bg-red-500 rounded hover:bg-red-700"
              >
              Cancelar
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");
                      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/solicitudes`, {
                          id_usuario2: selectedUser.id
                        }, {
                          headers: {
                          Authorization: `Bearer ${token}`
                        }
                      });
                      setRequestStatus("Solicitud enviada con éxito");
                      setShowFriendModal(false);
                      setSelectedUser({id: 0, nombre_usuario: ""});
                    } catch (err) {
                      console.error(err);
                      setRequestStatus("No se pudo enviar la solicitud.");
                    }
                  }}
              >
              Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbox;