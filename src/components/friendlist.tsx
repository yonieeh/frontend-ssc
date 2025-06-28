import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";

function FriendList({ onSelectFriend }: { onSelectFriend: (id: number) => void }) {
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<{ sent: any[], received: any[] }>({ sent: [], received: [] });
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFriends();
    console.log(friends);
    fetchRequests();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/amistades`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status !== 200) {
        throw new Error("Error al obtener amigos");
      }
      setFriends(response.data);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const requests = {
        sent: [],
        received: []
      };
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/solicitudes/enviadas`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status !== 200) {
        throw new Error("Error al obtener solicitudes enviadas");
      }
      requests.sent = response.data;
      const response2 = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/solicitudes/recibidas`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response2.status !== 200) {
        throw new Error("Error al obtener solicitudes recibidas");
      }
      requests.received = response2.data;
      console.log(requests);
      setRequests(requests);
    } catch (err) {
      console.error(err);
    }
  };

  const acceptRequest = async (id: number) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/solicitudes/${id}/aceptar`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status !== 200) {
        throw new Error("Error al aceptar solicitud");
      }
      fetchFriends();
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const declineRequest = async (id: number) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/solicitudes/${id}/rechazar`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status !== 200) {
        throw new Error("Error al rechazar solicitud");
      }
      fetchFriends();
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const cancelRequest = async (id: number) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/solicitudes/${id}/cancelar`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status !== 200) {
        throw new Error("Error al cancelar solicitud");
      }
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFriend = async (id: number) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/amistades/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status !== 200) {
        throw new Error("Error al eliminar amigo");
      }
      fetchFriends();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full h-full p-4 bg-transparent overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-black font-[Comic_Neue]">Amigos</h2>
        <button onClick={() => setOpen(true)} className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 hover:text-black transition duration-300 ease-in-out">
          Solicitudes
        </button>
      </div>

      <ul className="space-y-2">
        {friends.map((friend) => (
          <li key={friend.id_usuario} className="p-2 bg-gray-100 hover:bg-gray-400 rounded-md flex flex-row justify-between items-center">
            <div className="flex items-center" onClick={() => onSelectFriend(friend.id_amistad)}>
              <img src={friend.url_avatar} alt={friend.nombre_usuario} className="w-8 h-8 rounded-full text-black" />
              <span className="ml-2 text-black font-bold font-[Comic_Sans_MS]">{friend.nombre_usuario}</span>
            </div>
            <button onClick={() => handleRemoveFriend(friend.id_amistad)} className="text-red-500 px-4 py-2 rounded-md hover:text-red-800 transition duration-300 ease-in-out">
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
          <div className="fixed inset-0 bg-black/25" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
              <Dialog.Title className="text-2xl font-semibold font-[Comic_Neue] text-black text-center mb-4">Solicitudes de amistad</Dialog.Title>

              <div className="mb-7 max-h-60 overflow-y-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Recibidas</h3>
                {requests.received.length === 0 && <p className="text-sm text-gray-600">No tienes solicitudes nuevas.</p>}
                {requests.received.map((request) => (
                  <div key={request.id} className="flex justify-between items-center p-2 mb-2">
                    <span className="text-black">{request.remitente.nombre_usuario}</span>
                    <div className="flex gap-2">
                      <button onClick={() => acceptRequest(request.id)} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 hover:text-black transition duration-300 ease-in-out">
                        Aceptar
                      </button>
                      <button onClick={() => declineRequest(request.id)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 hover:text-black transition duration-300 ease-in-out">
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-7 max-h-60 overflow-y-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Enviadas</h3>
                {requests.sent.length === 0 && <p className="text-sm text-gray-600">No has enviados solicitudes nuevas.</p>}
                {requests.sent.map((request) => (
                  <div key={request.id} className="flex justify-between items-center p-2 mb-2">
                    <span className="text-black">{request.destinatario.nombre_usuario}</span>
                    <button onClick={() => cancelRequest(request.id)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 hover:text-black transition duration-300 ease-in-out">
                      Cancelar
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-right">
                <button onClick={() => setOpen(false)} className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 hover:text-black transition duration-300 ease-in-out">
                  Cerrar
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
};

export default FriendList;