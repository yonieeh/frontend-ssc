import Navbar from '../components/Navbar';

import stickmanLeaning from '../assets/stickman.png'
import registerButton from '../assets/register_button.png'
import registerButtonHover from '../assets/register_button_hover.png'
import loginButton from '../assets/login_button.png'
import loginButtonHover from '../assets/login_button_hover.png'
import groupChat from '../assets/group_chat.jpg'
import friendList from '../assets/friend_list.jpg'
import { useState } from 'react';
import { useRef } from 'react';

import { useEffect } from 'react';

import './instruction.css';

const slides = [
   {
    title: "¿Qué es Stickman Sigma Chat?",
    description: "Es un chat visual donde cada usuario es un stickman en una sala compartida, con movimiento y chat en tiempo real.",
    imageComponent: (
      <img
        src={groupChat}
        alt="Sala de chat con múltiples personas"
        className="w-fit h-auto object-contain mt-10 border-4 border-black hidden lg:block"
      />
    )
  },
  {
    title: "¿Cómo personalizar tu avatar?",
    description: "Al registrarte, puedes hacer un avatar stickman personalizado, cambiar colores y accesorios.",
    imageComponent: (
      <img
        src={groupChat}
        alt="Sala de chat con múltiples personas"
        className="w-fit h-auto object-contain mt-10 border-4 border-black hidden lg:block"
      />
    )
  },
  {
    title: "¿Cómo chatear?",
    description: "Usa el campo de texto para escribir tu mensaje y sera visible para los demás en el chat.",
    imageComponent: (
      <img
        src={groupChat}
        alt="Sala de chat con múltiples personas"
        className="w-fit h-auto object-contain mt-10 border-4 border-black hidden lg:block"
      />
    )
  },
  {
    title: "Explora la sala",
    description: "Usa las teclas de dirección para moverte por la sala.",
    imageComponent: (
      <img
        src={groupChat}
        alt="Sala de chat con múltiples personas"
        className="w-fit h-auto object-contain mt-10 border-4 border-black hidden lg:block"
      />
    )
  },
  {
    title: "Lista de amigos",
    description: "Agrega amigos. Podrás ver cuándo están conectados y enviar mensajes privados.",
    imageComponent: (
      <img
        src={friendList}
        alt="Lista de amigos"
        className="w-fit h-auto object-contain mt-10 border-4 border-black hidden lg:block"
      />
    )
  },
];

function InstructionPage() {
  const [current, setCurrent] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Solo se ejecuta al montar el componente
  useEffect(() => {
    audioRef.current = new Audio('/audio.mp3');
    audioRef.current.volume = 0.5;
  }, []);

  const handleImageClick = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.warn('No se pudo reproducir el audio:', err);
      });
    }
  };

  const nextSlide = () => setCurrent((current + 1) % slides.length);
  const prevSlide = () => setCurrent((current - 1 + slides.length) % slides.length);

  return (
  <div className="min-h-screen flex flex-col justify-between relative m-0 pb-10 w-full max-w-none" style={{ backgroundImage: "url('/comic.png')"}}>
    <Navbar />

    <h1 className="text-4xl md:text-5xl font-bold text-center font-[Comic_Neue] mb-10 text-black">
      ¿Cómo usar Stickman Sigma Chat?
    </h1>
	<div className="flex justify-center items-start gap-10 w-full">
    <div className="w-full max-w-4xl mx-auto bg-white bg-opacity-80 p-6 rounded-2xl shadow-lg flex flex-col items-center text-black overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out w-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
        <div key={index} className="w-full flex-shrink-0 flex flex-col items-center justify-center px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-[Comic_Neue] mb-4">
            {slide.title}
          </h2>
          <p className="text-md md:text-lg font-[Comic_Sans_MS]">
            {slide.description}
          </p>
          <div className="w-full max-w-sm h-auto object-contain hidden lg:block">
            {slide.imageComponent}
          </div>
        </div>
        ))}
      </div>
      <div className="flex justify-between w-full mt-8 px-10">
        <button
          onClick={prevSlide}
          className="text-lg font-bold px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          ← Anterior
        </button>
        <button
          onClick={nextSlide}
          className="text-lg font-bold px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Siguiente →
        </button>
      </div>
    </div>
	<div className="flex justify-end my-10 h-150">
	  <img
	    src={stickmanLeaning}
	    alt="Stickman leaning"
	    className="w-fit h-auto object-contain cursor-pointer"
	    onClick={handleImageClick}
	  />
	</div>
	</div>
	<div className="flex justify-center w-full gap-[15vw] items-center">
        <button className="group p-0 border-none bg-transparent w-40">
          <div className="relative w-40 h-fit">
            <img
              src={loginButton}
              alt="Login Button"
              className="group-hover:opacity-0 transition-opacity duration-200"
              />

            <img
              src={loginButtonHover}
              alt="Login Button Hover"
              className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            />
          </div>
        </button>

        <button className="group p-0 bg-transparent border-none w-40">
          <div className="relative w-40 h-fit">
            <img
              src={registerButton}
              alt="Register Button"
              className="group-hover:opacity-0 transition-opacity"
            />
            <img
              src={registerButtonHover}
              alt="Register Button Hover"
              className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </button>
      </div>
  </div>
);

}

export default InstructionPage;
