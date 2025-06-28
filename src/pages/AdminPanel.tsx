import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import UserList from '../components/UserList';
import RoomList from '../components/RoomList';
import MessageList from '../components/MessageList';
import axios from 'axios';

interface User {
  id: number;
  nombre_usuario: string;
  correo: string;
  // etc
}

function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // token para autorización
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        setError('Error al obtener usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('¿Seguro que quieres eliminar este usuario?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      alert('Error al eliminar usuario');
    }
  };

  return (
  <div
    className="min-h-screen flex flex-col justify-between relative m-0 pb-10 w-full max-w-none"
    style={{ backgroundImage: "url('/comic.png')" }}
  >
    <Navbar />
    <div className="flex-grow flex flex-col items-center justify-start p-6 bg-white rounded-2xl shadow-lg w-[90%] md:w-[80%] lg:w-[60%] xl:w-[40%] text-black mt-8">
      <h1 className="text-3xl font-bold text-center font-[Comic_Neue] mb-6">
        Admin Panel
      </h1>

      <section className="w-full">
        <h2 className="text-2xl font-semibold mb-4 font-[Comic_Neue]">Usuarios</h2>
        <UserList token={token} />
      </section>

      <section className="w-full mt-10">
        <h2 className="text-2xl font-semibold mb-4 font-[Comic_Neue]">Salas</h2>
        <RoomList token={token} />
      </section>

      <section className="w-full mt-10">
        <h2 className="text-2xl font-semibold mb-4 font-[Comic_Neue]">Mensajes</h2>
        <MessageList token={token} />
      </section>
    </div>
  </div>
);
}

export default AdminPanel;
