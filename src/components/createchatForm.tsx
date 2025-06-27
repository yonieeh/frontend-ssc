import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CrearSalaForm(){
    const [nombreSala, setNombreSala] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombreSala.trim()) {
            setError("El nombre no puede estar vacío");
            return;
        }
        try {
           const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/salas`,
        { nombre: nombreSala, password: password || null },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/chatlist");
    } catch (err) {
      console.error("Error creando sala:", err);
      setError("Ocurrió un error al crear la sala.");
    }
  };

   return (
    <div className="flex items-center justify-center h-full px-4">
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-sm bg-white/80 shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-300"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-[#1a1a1a] font-[Comic_Sans_MS]">
          Crear nueva sala
        </h2>

        <label
          htmlFor="nombre"
          className="block mb-2 text-sm font-semibold text-gray-700"
        >
          Nombre de la sala
        </label>
        <input
          id="nombre"
          type="text"
          value={nombreSala}
          onChange={(e) => {
            setNombreSala(e.target.value);
            if (error) setError("");
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#2a2a2a] bg-white text-[#1a1a1a]"
          placeholder="Sé creativo!"
        />

        <label
          htmlFor="password"
          className="block mb-2 text-sm font-semibold text-gray-700"
        >
          Contraseña (opcional)
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError("");
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#2a2a2a] bg-white text-[#1a1a1a]"
          placeholder="Deja en blanco para que tu sala sea pública"
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-[#2a2a2a] text-white py-2 rounded-lg hover:bg-[#1a1a1a] transition duration-200 font-semibold"
        >
          Crear sala
        </button>
      </form>
    </div>
  );
}

export default CrearSalaForm;