import { useEffect, useState } from 'react';
import axios from "../config/axiosconfig";

interface User {
  id: number;
  nombre_usuario: string;
  correo: string;
  rol: {
    nombre_rol: string;
  }
}

interface UserListProps {
  token: string | null;
}

function UserList({ token }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch {
        setError('Error al obtener usuarios');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUsers();
  }, [token]);

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('¿Seguro que quieres eliminar este usuario?')) return;

    try {
      setDeleting({ [userId]: true });
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u.id !== userId));
    } catch {
      alert('Error al eliminar usuario');
    } finally {
      setDeleting({});
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <>
      <input
        type="text"
        placeholder="Buscar usuario..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 border border-gray-300 px-2 py-1 rounded text-black font-[Comic_Sans_MS] w-full"
      />
      <table className="table-auto w-full text-left text-black font-[Comic_Sans_MS]">
        <thead>
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Usuario</th>
            <th className="border px-2 py-1">Correo</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.filter(user => user.rol.nombre_rol !== 'admin' && user.nombre_usuario.toLowerCase().includes(search.toLowerCase())).map(user => (
            <tr key={user.id}>
              <td className="border px-2 py-1">{user.id}</td>
              <td className="border px-2 py-1">{user.nombre_usuario}</td>
              <td className="border px-2 py-1">{user.correo}</td>
              <td className="border px-2 py-1">
                {!deleting[user.id] && (
                  <button
                    onClick={() => handleDeleteUser(user.id)}
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

export default UserList;
