import { useState, useEffect, Fragment, useCallback } from "react";
import axios from "../config/axiosconfig";
import { Dialog, Transition } from "@headlessui/react";
import { useSocket } from "../context/socketcontext-utils";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";  
import realtiveTime from "dayjs/plugin/relativeTime";
import locale from "dayjs/locale/es";
dayjs.extend(realtiveTime);
dayjs.locale(locale);

interface Usuario {
  id: number;
  nombre_usuario: string;
  correo?: string;
  id_avatar?: number;
  url_avatar?: string;
}

interface Estado {
  id: number;
  id_usuario: number;
  nombre_estado: string;
  ultima_act: string;
  usuario: Usuario;
}

interface Amistad {
  id_amistad: number;
  id_usuario: number;
  nombre_usuario: string;
  url_avatar: string;
}

interface Solicitud {
  id: number;
  id_usuario1: number;
  id_usuario2: number;
  estado: string;
  remitente?: Usuario;
  destinatario?: Usuario;
}

function FriendList({ onSelectFriend, selectedFriendshipID }: { onSelectFriend: (id: number | null, friendName: string, friendAvatar: string) => void; selectedFriendshipID: number | null }) {
  const socket = useSocket();
  const [friends, setFriends] = useState<Amistad[]>([]);
  const [requests, setRequests] = useState<{ sent: Solicitud[], received: Solicitud[] }>({ sent: [], received: [] });
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Estado[]>([]);
  const [isUnfriending, setIsUnfriending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const token = localStorage.getItem("token");
  const userID = (token) ? parseInt((jwtDecode(token) as { subject: string }).subject) : null;



  useEffect(() => {
    if (userID) {
      socket.emit("openFriendList", userID);
    }

    return () => {
      if (userID) {
        socket.emit("closeFriendList", userID);
      }
    }
  }, [userID, socket]);

  const fetchStatus = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/estados`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status !== 200) throw new Error("Error al obtener status");
      setStatus(response.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const fetchRequests = useCallback(async () => {
    try {
      const requests = { sent: [], received: [] };
      const sentRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/solicitudes/enviadas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const recvRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/solicitudes/recibidas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (sentRes.status !== 200 || recvRes.status !== 200)
        throw new Error("Error al obtener solicitudes");

      requests.sent = sentRes.data;
      requests.received = recvRes.data;
      setRequests(requests);
    } catch (err) {
      console.error(err);
    }
  }, [token]);



  const fetchFriends = useCallback(async () => {
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
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const acceptRequest = async (id: number) => {
    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/solicitudes/${id}/aceptar`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status !== 200) {
        throw new Error("Error al aceptar solicitud");
      }
      socket.emit("acceptFriendRequest", response.data.id_usuario1);
      fetchFriends();
      fetchRequests();
      fetchStatus();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const declineRequest = async (id: number) => {
    try {
      setLoading(true);
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/solicitudes/${id}/rechazar`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status !== 200) {
        throw new Error("Error al rechazar solicitud");
      }
      socket.emit("declineFriendRequest", response.data.id_usuario1);
      fetchFriends();
      fetchRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async (id: number) => {
    try {
      setCancelling(true);
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/solicitudes/${id}/cancelar`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status !== 200) {
        throw new Error("Error al cancelar solicitud");
      }
      socket.emit("cancelFriendRequest", response.data.id_usuario2);
      fetchRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setCancelling(false);
    }
  };

  const handleRemoveFriend = async (id: number) => {
    try {
      setIsUnfriending(true);
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/amistades/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status !== 200) {
        throw new Error("Error al eliminar amigo");
      }
      if (parseInt(response.data.id_usuario1) === userID) {
        socket.emit("unfriend", response.data.id_usuario2, id);
      } else {
        socket.emit("unfriend", response.data.id_usuario1, id);
      }
      fetchFriends();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUnfriending(false);
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchRequests();
    fetchStatus();
  }, [fetchFriends, fetchRequests, fetchStatus]);

  useEffect(() => {
    function handleUnfriend({ id_amistad }: { id_amistad: number }) {
      if (selectedFriendshipID === id_amistad) {
        onSelectFriend(null, "", "");
      }

      fetchFriends();
    }

    socket.on("friendRemoved", handleUnfriend);

    return () => {
      socket.off("friendRemoved", handleUnfriend);
    }
  }, [socket, selectedFriendshipID, onSelectFriend, fetchFriends]);

  useEffect(() => {
    const handleRefreshFriendList = () => {
      fetchFriends();
      fetchStatus();
    };

    const handleRefreshFriendRequests = () => {
      fetchRequests();
    }
    socket.on("refreshFriendList", handleRefreshFriendList);

    socket.on("refreshFriendRequests", handleRefreshFriendRequests);

    return () => {
      socket.off("refreshFriendList", handleRefreshFriendList);
      socket.off("refreshFriendRequests", handleRefreshFriendRequests);
    }
  }, [socket, fetchFriends, fetchRequests, fetchStatus]);

  return (
    <div className="w-full h-full p-4 bg-transparent overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-black font-[Comic_Neue]">Amigos</h2>
        <button onClick={() => setOpen(true)} className="bg-black text-white px-4 py-2 rounded-md hover:bg-white hover:text-black border-2 border-black transition duration-300 ease-in-out font-[Comic_Sans_MS]">
          Solicitudes
        </button>
      </div>

      <ul className="space-y-2">
        {friends.map((friend) => {
          const friendStatus = status.find((status) => status.usuario.id === friend.id_usuario);

          return (
            <li 
              key={friend.id_usuario} 
              className="p-2 bg-gray-100 hover:bg-gray-400 rounded-md flex flex-row justify-between items-center" 
              onClick={() => {
                if (selectedFriendshipID === friend.id_amistad) {
                  onSelectFriend(null, "", "");
                } else {
                  onSelectFriend(friend.id_amistad, friend.nombre_usuario, friend.url_avatar);
                }
              }}
            >
              <div className="flex items-center">
                <img src={friend.url_avatar} alt={friend.nombre_usuario} className="w-8 h-8 rounded-full text-black mr-2" />
                <div className="flex flex-col">
                  <span className="ml-2 text-black font-bold font-[Comic_Sans_MS] text-left">{!friend.nombre_usuario ? "usuario eliminado" : friend.nombre_usuario}</span>
                  {friendStatus && (
                    friendStatus.nombre_estado === "En linea" ? (
                      <p className="text-sm text-green-600 font-semibold font-[Comic_Sans_MS] ml-2">🟢 En línea</p>
                    ) : (
                      <p className="text-sm text-gray-600 italic ml-2">
                        Última conexión {dayjs(friendStatus.ultima_act).fromNow()}
                      </p>
                    )
                  )}
                </div>
              </div>
              {!isUnfriending && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const result = window.confirm('¿Seguro que quieres eliminar a este amigo?');
                    if (!result) return;
                    handleRemoveFriend(friend.id_amistad);
                    onSelectFriend(null, "", "");
                    selectedFriendshipID = null;
                  }} 
                  className="text-red-500 px-4 py-2 rounded-md hover:text-red-800 transition duration-300 ease-in-out font-[Comic_Sans_MS]"
                >
                  Eliminar
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
          <div className="fixed inset-0 bg-black/25" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
              <Dialog.Title className="text-2xl font-semibold font-[Comic_Neue] text-black text-center mb-4">Solicitudes de amistad</Dialog.Title>

              <div className="mb-7 max-h-60 overflow-y-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-2 font-[Comic_Neue]">Recibidas</h3>
                {requests.received.length === 0 && <p className="text-sm text-gray-600 font-[Comic_Sans_MS]">No tienes solicitudes nuevas.</p>}
                {requests.received.map((request) => (
                  <div key={request.id} className="flex justify-between items-center p-2 mb-2">
                    <span className="text-black font-[Comic_Sans_MS]">{request.remitente?.nombre_usuario ?? "Usuario desconocido"}</span>
                    <div className="flex gap-2">
                      {!loading && (
                        <>
                          <button onClick={() => acceptRequest(request.id)} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 hover:text-black transition duration-300 ease-in-out font-[Comic_Sans_MS]">
                            Aceptar
                          </button>
                          <button onClick={() => declineRequest(request.id)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 hover:text-black transition duration-300 ease-in-out font-[Comic_Sans_MS]">
                            Rechazar
                          </button>
                        </>  
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-7 max-h-60 overflow-y-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-2 font-[Comic_Neue]">Enviadas</h3>
                {requests.sent.length === 0 && <p className="text-sm text-gray-600 font-[Comic_Sans_MS]">No has enviados solicitudes nuevas.</p>}
                {requests.sent.map((request) => (
                  <div key={request.id} className="flex justify-between items-center p-2 mb-2">
                    <span className="text-black font-[Comic_Sans_MS]">{request.destinatario?.nombre_usuario ?? "Usuario desconocido"}</span>
                    {!cancelling && (
                      <button onClick={() => cancelRequest(request.id)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 hover:text-black transition duration-300 ease-in-out font-[Comic_Sans_MS]">
                        Cancelar
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 text-right">
                <button onClick={() => setOpen(false)} className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 hover:text-black transition duration-300 ease-in-out font-[Comic_Sans_MS]">
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