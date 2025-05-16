import logo from "../assets/logo.png";
import React from "react";

function Navbar() {
  return (
    <nav className="w-full m-0 p-0 flex justify-between items-center p-4 bg-transparent text-white">
      <a href="/">
        <img src={logo} alt="Logo" className="w-auto h-15"/>
      </a>
      <ul className="flex space-x-4">
        <li><a href="/about-us" className="hover:underline text-black font-[Comic_Sans_MS]">Equipo</a></li>
        <li><a href="#" className="hover:underline text-black font-[Comic_Sans_MS]">Iniciar sesión</a></li>
        <li><a href="#" className="hover:underline text-black font-[Comic_Sans_MS]">Registrarse</a></li>
      </ul>
    </nav>
  )
}

export default Navbar