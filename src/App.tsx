import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import stickmanLeaning from './assets/stickman.png'
import './App.css'
import './index.css'
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between relative m-0 p-0 w-full max-w-none">
      <Navbar />
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-center font-[Comic_Neue] pt-10">
        Stickman Sigma Chat
      </h1>

      {/* Stickman Image aligned to the right */}
      <div className="flex justify-end my-10">
        <img
          src={stickmanLeaning}
          alt="Stickman leaning"
          className="w-40 md:w-60 lg:w-72 object-contain"
        />
      </div>

      {/* Bottom Buttons */}
      <div className="flex justify-center gap-[33vw] pb-10">
        <button className="bg-white text-black border border-black px-6 py-3 text-lg hover:bg-gray-200 transition-colors duration-200">
          Login
        </button>
        <button className="bg-black text-white border border-black px-6 py-3 text-lg hover:bg-gray-800 transition-colors duration-200">
          Register
        </button>
      </div>
    </div>
  );
}

export default App
