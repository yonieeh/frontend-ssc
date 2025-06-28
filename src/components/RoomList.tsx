import { useEffect, useState } from 'react';
import axios from 'axios';

interface Room {
  id: number;
  nombre: string; // Ajusta según tu modelo (p.ej. nombre, título, etc)
  descripcion?: string; // Opcional, si tienes descripción u otro campo
}

interface RoomListProps {
  token: string | null;
}

function RoomList({ token }: RoomListProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  if (loading) return <p>Cargando salas...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <table className="table-auto w-full text-left font-[Comic_Sans_MS]">
      <thead>
        <tr>
          <th className="border px-2 py-1">ID</th>
          <th className="border px-2 py-1">Nombre</th>
          <th className="border px-2 py-1">Descripción</th>
          <th className="border px-2 py-1">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {rooms.map(room => (
          <tr key={room.id}>
            <td className="border px-2 py-1">{room.id}</td>
            <td className="border px-2 py-1">{room.nombre}</td>
            <td className="border px-2 py-1">{room.descripcion || '-'}</td>
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
  );
}

export default RoomList;
