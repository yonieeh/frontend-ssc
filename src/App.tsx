import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './index.css'
import Navbar from './components/Navbar';

import stickmanLeaning from './assets/stickman.png'
import stickmanLeaningDark from './assets/stickman_darkmode.png'
import registerButton from './assets/register_button.png'
import registerButtonHover from './assets/register_button_hover.png'
import loginButton from './assets/login_button.png'
import loginButtonHover from './assets/login_button_hover.png'

function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between relative m-0 pb-10 w-full max-w-none" style={{ backgroundImage: "url('/comic.png')"}}>
      <Navbar />
      {/* Title */}
      <h1 id="title" className="text-4xl md:text-5xl font-bold text-center font-[Comic_Neue]">
        Stickman Sigma Chat
      </h1>

      {/* Stickman Image aligned to the right */}
      <div className="flex justify-end my-10 h-150">
        <img
          src={stickmanLeaning}
          alt="Stickman leaning"
          className="w-fit h-auto object-contain"
        />
      </div>

      {/* Bottom Buttons */}
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

export default App
