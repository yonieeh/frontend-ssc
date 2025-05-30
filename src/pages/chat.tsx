import Navbar from "../components/Navbar";
import Stickmanarea from "../components/stickmanarea.tsx";
import Chatbox from "../components/chatbox.tsx";
import "./chat.css";


function Chat() {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden" style={{ backgroundImage: "url('/comic.png')" }}>
      <div className="sticky top-0 z-50 ">
        <Navbar />
      </div>

      <div className="flex flex-1 m-15 gap-6 h-[60%]">
        <Stickmanarea />
        <Chatbox />
      </div>
    </div>
  )
}

export default Chat