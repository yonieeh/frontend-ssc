import { useState, useEffect, useRef } from "react";

const randomUsername = () => {
  const usernames = ["pabloarellano25", "yonieeh", "JeibiCL", "peponix360", "waldonepe", "rzinss", "sanqrider", "megulover", "Carrasco", "srPerez", "ryanyamal", "vewe", "lewa", "mbappe", "valverde", "zampedri"];
  return usernames[Math.floor(Math.random() * usernames.length)];
}

const localStorageKey = "chatmessages";

function Chatbox() {
  const [chatMessages, setChatMessages] = useState<{ username: string; message: string }[]>([]);
  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  useEffect(() => {
    const storedMessages = localStorage.getItem(localStorageKey);
    if (storedMessages) {
      setChatMessages(JSON.parse(storedMessages));
    }
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage = { username: randomUsername(), message: input };
    setChatMessages((prev) => [...prev, newMessage]);
    setInput("");
    localStorage.setItem(localStorageKey, JSON.stringify([...chatMessages, newMessage]));
  };
  
  return (
    <div className="w-[25%] min-w-[280px] bg-[#f5f5f5] border-3 border-[#2a2a2a] flex flex-col p-4 h-full">
      <div className="flex-1 overflow-y-auto bg-[#f0f0f0] p-2 space-y-2 text-sm font-[Comic_Sans_MS] text-[#1a1a1a]">
        {chatMessages.map((message, index) => (
          <div key={index}>
            <strong>{message.username}:</strong> {message.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex w-full gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="mt-4 p-2 border border-gray-300 font-[Comic_Sans_MS] focus:outline-none focus:ring-2 focus:ring-[#2a2a2a] text-[#1a1a1a]"
          placeholder="Escribe tu mensaje..."
        />
        <button
          onClick={sendMessage}
          className="mt-4 p-2 border border-gray-300 font-[Comic_Sans_MS] focus:outline-none focus:ring-2 focus:ring-[#2a2a2a] text-[#1a1a1a]"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

export default Chatbox;