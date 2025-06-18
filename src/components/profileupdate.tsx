import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function ProfileUpdate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    contrasena: '',
    confirmarContrasena: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert('Inicia sesión para actualizar tus datos');
        navigate('/login');
        return;
      }
      const decodedToken: { subject: string } = jwtDecode(token);
      const userId = decodedToken.subject;
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
      if (Object.keys(data).length === 0) {
        alert('Por favor ingresa al menos un campo para actualizar');
        return;
      }
      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/usuarios/${userId}`, data, {
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
    }
  };

  const handleDelete = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      const confirm = window.confirm('Estas seguro de querer eliminar tu cuenta?');
      if (!confirm) {
        return;
      }
      const token = localStorage.getItem("token") || "";
      const decodedToken: { subject: string } = jwtDecode(token);
      const userId = decodedToken.subject;
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/usuarios/${userId}`, {
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
          className="p-2 border" 
        />
        <input 
          type="password" 
          id="contrasena" 
          name="contrasena" 
          placeholder='Ingresa tu contraseña nueva'
          value={formData.contrasena} 
          onChange={handleChange} 
          className="p-2 border" 
        />
        <input 
          type="password" 
          id="confirmarContrasena" 
          name="confirmarContrasena" 
          placeholder='Confirma tu contraseña'
          value={formData.confirmarContrasena} 
          onChange={handleChange} 
          className="p-2 border" 
        />
        <button 
          type="submit" 
          className="group p-2 bg-transparent border border-black hover:bg-black hover:text-white justify-center text-center w-[75%] items-center mx-auto transition-colors duration-200"
        >
          Actualizar Datos
        </button>
        <button 
          type="button" 
          className="group p-2 bg-red-500 border border-red-500 hover:text-white justify-center text-center w-[75%] items-center mx-auto transition-colors duration-200" 
          onClick={handleDelete}
        >
          Eliminar cuenta
        </button>

    </form>
  );
}

export default ProfileUpdate;