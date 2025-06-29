import Navbar from "../components/Navbar";
import Stickmanarea from "../components/stickmanarea.tsx";
import Chatbox from "../components/chatbox.tsx";
import "./chat.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Chat() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    }
  }, []);
  
  return (
    <div className="flex flex-col h-screen w-full" style={{ backgroundImage: "url('/comic.png')" }}>
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="flex flex-col md:flex-row flex-1 p-4 gap-4 overflow-hidden">
        <div className="w-full md:w-3/4 h-[60vh] md:h-full">
          <Stickmanarea />
        </div>

        <div className="w-full md:w-1/4 h-[40vh] md:h-full">
          <Chatbox />
        </div>
      </div>
    </div>
  );
}

export default Chat;
