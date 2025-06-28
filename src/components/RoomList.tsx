import { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';

interface Room {
  id: number;
  nombre: string; // Ajusta según tu modelo (p.ej. nombre, título, etc)
  descripcion?: string; // Opcional, si tienes descripción u otro campo
}

interface Message {
  id: number;
  contenido: string;
  usuario: {
    id: number;
    nombre_usuario: string;
  }
}

interface RoomListProps {
  token: string | null;
}

function RoomList({ token }: RoomListProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/rooms`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRooms(res.data);
      } catch {
        setError('Error al obtener salas');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchRooms();
  }, [token]);

  const handleDeleteRoom = async (roomId: number) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta sala?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms(rooms.filter(r => r.id !== roomId));
    } catch {
      alert('Error al eliminar sala');
    }
  };

  const handleViewMessages = async (roomId: number) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/rooms/${roomId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
      setSelectedRoom(roomId);
      setIsOpen(true);
    } catch {
      alert('Error al obtener mensajes');
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!window.confirm('¿Seguro que quieres eliminar este mensaje?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(messages.filter(m => m.id !== messageId));
    } catch {
      alert('Error al eliminar mensaje');
    }
  };


  if (loading) return <p>Cargando salas...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <>
      <input
        type="text"
        placeholder="Buscar sala..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1 mb-4 text-black font-[Comic_Sans_MS] w-full"
      />
      <table className="table-auto w-full text-left text-black font-[Comic_Sans_MS]">
        <thead>
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Mensajes</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rooms.filter(r => r.nombre.toLowerCase().includes(search.toLowerCase())).map(room => (
            <tr key={room.id}>
              <td className="border px-2 py-1">{room.id}</td>
              <td className="border px-2 py-1">{room.nombre}</td>
              <td className="border px-2 py-1">
                <button
                  onClick={() => handleViewMessages(room.id)}
                  className="text-white bg-black px-2 py-1 rounded hover:bg-white hover:text-black hover:border border-black transition"
                  >
                  Ver mensajes
                </button>
              </td>
              <td className="border px-2 py-1">
                <button
                  onClick={() => handleDeleteRoom(room.id)}
                  className="border border-red-600 text-red-600 px-2 py-1 rounded hover:bg-red-600 hover:text-white transition"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <div className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounder-lg p-6 w-full max-w-2xl shadow-xl">
              <Dialog.Title
                className="text-xl font-semibold text-black mb-4 font-[Comic_Sans_MS]"
              >
                Mensajes de la sala {selectedRoom}
              </Dialog.Title>
              <div className="max-h-[50vh] overflow-y-auto space-y-2">
                {messages.length === 0 ? (
                  <p>No hay mensajes en esta sala</p>
                ) : (
                  messages.map(message => (
                    <div key={message.id} className="text-black border-b pb-2 px-3 flex justify-between items-start">
                      <div>
                        <strong>{message.usuario.nombre_usuario}:</strong> {message.contenido}
                      </div>
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="border border-red-600 text-red-600 px-2 py-1 rounded hover:bg-red-600 hover:text-white transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 text-right">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white bg-black px-2 py-1 rounded hover:bg-white hover:text-black hover:border border-black transition"
                >
                  Cerrar
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default RoomList;
