import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { jwtDecode } from "jwt-decode"; // instalar esto: npm install jwt-decode


function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    setIsLoggedIn(true);
    try {
      const decoded = jwtDecode(token) as { scope: string[] };
      if (decoded.scope && decoded.scope.includes('admin')) {
        setIsAdmin(true);
      }
    } catch (err) {
      console.error("Error decoding token:", err);
    }
  }
}, []);


  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  }

  return (
    <nav className="w-full bg-transparent text-white px-4 py-3 flex justify-between items-center">
      <a href="/">
        <img src={logo} alt="Logo" className="h-12 w-auto" />
      </a>


      <div className="flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden mr-4 focus:outline-none"
          aria-label="Toggle navigation"
        >
          <svg
            className="w-6 h-6 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <ul className="hidden md:flex space-x-4 text-black font-[Comic_Sans_MS]">
          <li><a href="/about-us" className="hover:underline">Equipo</a></li>
          <li><a href="/instructions" className="hover:underline">Instrucciones</a></li>
          {isLoggedIn ? (
            <>
              <li><a href="/friendlist" className="hover:underline">Amigos</a></li>
              <li><a href="/chatlist" className="hover:underline">Empieza a chatear!</a></li>
              <li><a href="/profile" className="hover:underline">Perfil</a></li>
              {isAdmin && (<li><a href="/admin" className="hover:underline">Admin</a></li>)}

              <li><button onClick={handleLogout} className="hover:underline">Cerrar sesión</button></li>
            </>
          ) : (
            <>
              <li><a href="/login" className="hover:underline">Iniciar sesión</a></li>
              <li><a href="/register" className="hover:underline">Registrarse</a></li>
            </>
          )}
        </ul>
      </div>

      {isOpen && (
        <div className="absolute top-[70px] left-0 right-0 bg-white text-black font-[Comic_Sans_MS] flex flex-col items-start p-4 space-y-2 md:hidden z-50">
          <a href="/about-us" onClick={() => setIsOpen(false)} className="hover:underline">Equipo</a>
          <a href="/instructions" onClick={() => setIsOpen(false)} className="hover:underline">Instrucciones</a>
          {isLoggedIn ? (
            <>
              {isAdmin && (<a href="/admin" onClick={() => setIsOpen(false)} className="hover:underline">Admin</a>)}
              <a href="/friendlist" onClick={() => setIsOpen(false)} className="hover:underline">Amigos</a>
              <a href="/chatlist" onClick={() => setIsOpen(false)} className="hover:underline">Empieza a chatear!</a>
              <a href="/profile" onClick={() => setIsOpen(false)} className="hover:underline">Perfil</a>
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="hover:underline">Cerrar sesión</button>
            </>
          ) : (
            <>
              <a href="/login" onClick={() => setIsOpen(false)} className="hover:underline">Iniciar sesión</a>
              <a href="/register" onClick={() => setIsOpen(false)} className="hover:underline">Registrarse</a>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar