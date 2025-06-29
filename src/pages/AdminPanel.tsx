import Navbar from '../components/Navbar';
import UserList from '../components/UserList';
import RoomList from '../components/RoomList';
import MessageList from '../components/MessageList';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

function AdminPanel() {
  const navigate = useNavigate();
  // token para autorización
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    const decodedToken: { scope: string[] } = jwtDecode(token);
    
    if (!decodedToken.scope.includes('admin')) {
      navigate('/');
      return;
    }
  }, [token, navigate]);

  return (
  <div
    className="min-h-screen w-full flex flex-col items-center"
    style={{ backgroundImage: "url('/comic.png')" }}
  >
    <Navbar />
    <div className="w-full px-6 py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center text-black font-[Comic_Neue] mb-6">
        Admin Panel
      </h1>

      <div className="w-full flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 overflow-auto max-h-[75vh]">
          <h2 className="text-2xl font-bold text-black font-[Comic_Neue] mb-4">
            Usuarios
          </h2>
          <UserList token={token} />
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 overflow-auto max-h-[75vh]">
          <h2 className="text-2xl font-bold text-black font-[Comic_Neue] mb-4">
            Salas
          </h2>
          <RoomList token={token} />
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 overflow-auto max-h-[75vh]">
          <h2 className="text-2xl font-bold text-black font-[Comic_Neue] mb-4">
            Mensajes
          </h2>
          <MessageList token={token} />
        </div>
      </div>
    </div>
  </div>
);
}

export default AdminPanel;
