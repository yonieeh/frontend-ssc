import logo from "../assets/logo.png";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="w-full m-0 p-0 flex justify-between items-center p-4 bg-transparent text-white">
      <a href="/">
        <img src={logo} alt="Logo" className="w-auto h-15"/>
      </a>
      <ul className="flex space-x-4">
        <li><a href="/chat" className="hover:underline text-black font-[Comic_Sans_MS]">Empieza a chatear!</a></li>
        <li><a href="/about-us" className="hover:underline text-black font-[Comic_Sans_MS]">Equipo</a></li>
		<li><a href="/instructions" className="hover:underline text-black font-[Comic_Sans_MS]">Instrucciones</a></li>
        <li><a href="/login" className="hover:underline text-black font-[Comic_Sans_MS]">Iniciar sesión</a></li>
        <li><a href="/register" className="hover:underline text-black font-[Comic_Sans_MS]">Registrarse</a></li>
      </ul>
    </nav>
  )
}

export default Navbar