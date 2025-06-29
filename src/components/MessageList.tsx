import { useEffect, useState } from 'react';
import axios from "../config/axiosconfig";

interface Message {
  id: number;
  contenido: string; // Ajusta según el campo de mensaje en tu backend
  id_usuario: number; // o el nombre que corresponda para usuario
  fecha_creacion?: string; // si tienes fecha u otro dato extra
}

interface MessageListProps {
  token: string | null;
}

function MessageList({ token }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
      } catch {
        setError('Error al obtener mensajes');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchMessages();
  }, [token]);

  const handleDeleteMessage = async (messageId: number) => {
    if (!window.confirm('¿Seguro que quieres eliminar este mensaje?')) return;

    try {
      setDeleting({ [messageId]: true });
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(messages.filter(m => m.id !== messageId));
    } catch {
      alert('Error al eliminar mensaje');
    } finally {
      setDeleting({});
    }
  };

  if (loading) return <p>Cargando mensajes...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <>
      <input
        type="text"
        placeholder="Buscar mensajes..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1 mb-4 w-full text-black font-[Comic_Sans_MS]"
      />
      <table className="table-auto w-full text-left text-black font-[Comic_Sans_MS]">
        <thead>
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Contenido</th>
            <th className="border px-2 py-1">ID Usuario</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {messages.filter(message => message.contenido.toLowerCase().includes(search.toLowerCase())).map(message => (
            <tr key={message.id}>
              <td className="border px-2 py-1">{message.id}</td>
              <td className="border px-2 py-1">{message.contenido}</td>
              <td className="border px-2 py-1">{message.id_usuario}</td>
              <td className="border px-2 py-1">
                {!deleting[message.id] && (
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    className="border border-red-600 text-red-600 px-2 py-1 rounded hover:bg-red-600 hover:text-white transition"
                  >
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default MessageList;
