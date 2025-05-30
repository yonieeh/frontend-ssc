import './landing.css';
import { Greeting } from '../components/saludo';
import Navbar from '../components/Navbar';

import stickmanLeaning from '../assets/stickman.png'
import registerButton from '../assets/register_button.png'
import registerButtonHover from '../assets/register_button_hover.png'
import loginButton from '../assets/login_button.png'
import loginButtonHover from '../assets/login_button_hover.png'
import groupChat from '../assets/group_chat.jpg'
import groupChatMobile from '../assets/group_chat_mobile.jpg'
import friendList from '../assets/friend_list.jpg'
import friendListMobile from '../assets/friend_list_mobile.jpg'

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between relative m-0 pb-10 w-full max-w-none" style={{ backgroundImage: "url('/comic.png')"}}>
      <Navbar />
      {/* Title */}
      <h1 id="main-title" className="text-4xl md:text-5xl font-bold text-center font-[Comic_Neue] text-black">
        Stickman Sigma Chat!!
      </h1>
      {/* Stickman Image aligned to the right */}
      <div className="flex justify-between pt-10">
        <div className="w-1/2 h-150 ml-7">
          <Greeting />
          <h3 id="main-desc" className="text-l md:text-xl font-[Comic_Sans_MS] mt-3 ml-2 text-black">
            Chatea con gente de todo el mundo, haz nuevos amigos y expresate a través de un stickman.
          </h3>
          <img 
            src={groupChatMobile}
            alt="Sala de chat con múltiples personas"
            className="w-fit h-auto object-contain mt-10 border-10 border-black sm:hidden"
            />
          <img
            src={groupChat}
            alt="Sala de chat con múltiples personas"
            className="w-fit h-auto object-contain mt-10 border-10 border-black hidden lg:block"
          />
        </div>

        <div className="flex justify-end my-10 h-150">
          <img
            src={stickmanLeaning}
            alt="Stickman leaning"
            className="w-fit h-auto object-contain"
            />
        </div>
      </div>

      <div className="flex justify-end my-10 w-full">
        <div className="w-[70%] h-150 mr-7">
          <h3 id="paragraph" className="text-l md:text-xl font-[Comic_Sans_MS] mt-3 mr-2 text-center">
            No pierdas contacto con la gente que conoces! Agrega a tus amigos y comienza a chatear.
          </h3>
          <img
            src={friendListMobile}
            alt="Lista de amigos"
            className="w-fit h-auto object-contain mt-10 border-10 border-black sm:hidden"
          />
          <img
            src={friendList}
            alt="Lista de amigos"
            className="w-fit h-auto object-contain mt-10 border-10 border-black hidden lg:block"
          />
        </div>
      </div>

      <h1 id="call-to-action" className="text-4xl md:text-5xl font-bold text-center font-[Comic_Neue] mb-10 mt-10 text-black">
        Crea una cuenta y empieza a conocer gente de todo el mundo!
      </h1>

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
  )
}

export default LandingPage