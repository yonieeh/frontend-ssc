import Navbar from "../components/Navbar";
import Stickmanarea from "../components/stickmanarea.tsx";
import Chatbox from "../components/chatbox.tsx";
import "./chat.css";

function Chat() {
  return (
    <div className="flex flex-col h-screen w-full" style={{ backgroundImage: "url('/comic.png')" }}>
      {/* Navbar stays on top */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Main content area: Stickman + Chat */}
      <div className="flex flex-col md:flex-row flex-1 p-4 gap-4 overflow-hidden">
        {/* Stickman takes 60vh on mobile, full height on desktop */}
        <div className="w-full md:w-3/4 h-[60vh] md:h-full">
          <Stickmanarea />
        </div>

        {/* Chat takes 40vh on mobile, full height on desktop */}
        <div className="w-full md:w-1/4 h-[40vh] md:h-full">
          <Chatbox />
        </div>
      </div>
    </div>
  );
}

export default Chat;
