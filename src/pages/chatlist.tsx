import Navbar from "../components/Navbar";
import "./chatlist.css";
import { useState, useEffect, Fragment } from "react";
import axios from "../config/axiosconfig";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";

function Chatlist() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<{ id: number; nombre: string, id_creador: number, contrasena: string | null } | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [chats, setChats] = useState<{ id: number; nombre: string, id_creador: number, contrasena: string | null }[]>([]);
  const [deleting, setDeleting] = useState<{ [key: number]: boolean }>({});
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/");
  }
  const decoded = jwtDecode(token ?? "") as { subject: string, scopes: string[] };
  const userID = decoded?.subject ?? null;
  const scopes: string[] = Array.isArray(decoded?.scopes) ? decoded.scopes : [];

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);


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
      setDeleting({ [id]: true });
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
    } finally {
      setDeleting({});
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
            onClick={() => {
              if (chat.contrasena) {
                setSelectedChat(chat);
                setIsOpen(true);
              } else {
                navigate(`/chat/${chat.id}`);
              }
            }}
            className="flex justify-between items-center p-4 bg-white shadow hover:bg-gray-100 transition-all duration-200 cursor-pointer"
          >
            <span className="text-lg font-semibold text-black font-[Comic_Neue]">{chat.nombre}</span>

            {(parseInt(userID) === chat.id_creador || scopes.includes("admin")) && !deleting[chat.id] && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  eliminarSala(chat.id);
                }}
                className="text-red-500 hover:text-red-700 transition duration-200 text-sm font-[Comic_Sans_MS]"
              >
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center px-4 py-2">
        <Link
          to="/create-chat"
          className="inline-block bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200 font-[Comic_Sans_MS]"
        >
          Crear nueva sala
        </Link>
      </div>

      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded bg-white p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-gray-800 font-[Comic_Neue]">Ingrese la contraseña</h2>
              <p className="text-sm text-gray-600 mb-4 font-[Comic_Sans_MS]">
                La sala "{selectedChat?.nombre}" está protegida por una contraseña.
              </p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-black font-[Comic_Sans_MS]"
                placeholder="Contraseña"
              />
              {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setPassword('');
                    setError('');
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-[Comic_Sans_MS]"
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");
                      const res = await axios.post(
                        `${import.meta.env.VITE_BACKEND_URL}/salas/${selectedChat?.id}/verificar`,
                        { contrasena: password },
                        { headers: { Authorization: `Bearer ${token}` } }
                      );

                      if (res.data.acceso) {
                        setIsOpen(false);
                        setPassword('');
                        setError('');
                        navigate(`/chat/${selectedChat?.id}`);
                      } else {
                        setError("Contraseña incorrecta");
                      }
                    } catch {
                      setError("Error al verificar la contraseña.");
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-[Comic_Sans_MS]"
                >
                  Entrar
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>

    </div>    
  );
}

export default Chatlist;