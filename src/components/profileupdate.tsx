import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function ProfileUpdate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usuario: '',
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
      const token = localStorage.getItem("token") || "";
      const decodedToken: { subject: string } = jwtDecode(token);
      const userId = decodedToken.subject;
      if (formData.contrasena !== formData.confirmarContrasena) {
        alert('Las contraseñas no coinciden');
        return;
      }
      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/usuarios/${userId}`, formData, {
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
      alert('Hubo un error al realizar el registro, inténtalo de nuevo');
    }
  };

  const handleDelete = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
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
      alert('Hubo un error al realizar el registro, inténtalo de nuevo');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 justify-center">
        <input 
          type="text" 
          id="usuario" 
          name="usuario" 
          placeholder='Ingresa tu usuario nuevo'
          value={formData.usuario} 
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