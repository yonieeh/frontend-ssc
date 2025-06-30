import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../config/axiosconfig";
import Customizer from './customizer';

function ProfileUpdate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    contrasena: '',
    confirmarContrasena: ''
  });
  const [avatarUpdate, setAvatarUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert('Inicia sesión para actualizar tus datos');
        navigate('/login');
        return;
      }
      const data: Record<string, string> = {};
      if (formData.nombre_usuario?.trim()) {
        data.nombre_usuario = formData.nombre_usuario.trim();
      }
      if (formData.contrasena?.trim()) {
        if (formData.contrasena !== formData.confirmarContrasena) {
          alert('Las contraseñas no coinciden');
          return;
        }
        data.contrasena = formData.contrasena.trim();
      }
      if (Object.keys(data).length === 0 && !avatarUpdate) {
        alert('Por favor ingresa al menos un campo para actualizar');
        return;
      }
      if (avatarUpdate) {
        return;
      }
      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/usuarios`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        alert('Datos modificados con exito!');
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      alert('Hubo un error al modificar los datos, por favor inténtalo de nuevo');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      setDeleting(true);
      const confirm = window.confirm('Estas seguro de querer eliminar tu cuenta?');
      if (!confirm) {
        return;
      }
      const token = localStorage.getItem("token") || "";
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/usuarios`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        alert('Cuenta eliminada con exito!');
        localStorage.removeItem('token');
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      alert('Hubo un error al eliminar la cuenta, por favor inténtalo de nuevo');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 justify-center">
        <input 
          type="text" 
          id="usuario" 
          name="nombre_usuario" 
          placeholder='Ingresa tu usuario nuevo'
          value={formData.nombre_usuario} 
          onChange={handleChange} 
          className="p-2 border font-[Comic_Sans_MS]" 
        />
        <input 
          type="password" 
          id="contrasena" 
          name="contrasena" 
          placeholder='Ingresa tu contraseña nueva'
          value={formData.contrasena} 
          onChange={handleChange} 
          className="p-2 border font-[Comic_Sans_MS]" 
        />
        <input 
          type="password" 
          id="confirmarContrasena" 
          name="confirmarContrasena" 
          placeholder='Confirma tu contraseña'
          value={formData.confirmarContrasena} 
          onChange={handleChange} 
          className="p-2 border font-[Comic_Sans_MS]" 
        />
        <Customizer onAvatarUpdated={() => setAvatarUpdate(true)}/>
        
        {(!updating && !deleting) && (
          <>
            <button 
              type="submit" 
              className="group p-2 bg-transparent border border-black hover:bg-black hover:text-white justify-center text-center w-[75%] items-center mx-auto transition-colors duration-200 font-[Comic_Sans_MS]"
            >
              Actualizar Datos
            </button>
            <button 
              type="button" 
              className="group p-2 bg-red-500 border border-red-500 hover:text-white justify-center text-center w-[75%] items-center mx-auto transition-colors duration-200 font-[Comic_Sans_MS]" 
              onClick={handleDelete}
            >
              Eliminar cuenta
            </button>
          </>  
        )}

    </form>
  );
}

export default ProfileUpdate;