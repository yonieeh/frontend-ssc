import Navbar from "../components/Navbar";
import "./chatlist.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
function Chatlist() {
    const [chats, setChats] = useState<{ id: number; nombre: string }[]>([]);
    useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/salas`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChats(res.data);
      } catch (err) {
        console.error("Error cargando las salas:", err);
      }
    };

    fetchChats();
}, []);

    const eliminarSala = async (id: number) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar esta sala?");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/salas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChats(chats.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error al eliminar sala:", error);
      alert("No se pudo eliminar la sala.");
    }
  };
  return (
    <div className="flex flex-col h-screen w-full" style={{ backgroundImage: "url('/comic.png')" }}>
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
     <div className="flex flex-col p-4 gap-4 overflow-y-auto">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className="flex justify-between items-center p-4 bg-white rounded shadow hover:bg-gray-100 transition-all duration-200"
        >
          <Link to={`/chat/${chat.id}`} className="text-gray-800 font-semibold">
            {chat.nombre}
          </Link>
          <button
            onClick={() => eliminarSala(chat.id)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
      <div className="flex justify-center px-4 py-2">
            <Link
                to="/create-chat"
                className="inline-block bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200"
            >
                Crear nueva sala
            </Link>
            </div>
                </div>    
);
    
}

export default Chatlist;