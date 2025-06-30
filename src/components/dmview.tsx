import { useState } from "react";
import FriendList from "./friendlist";
import DirectChat from "./directchat";

function DirectMessageView() {
  const [selectedFriendshipID, setSelectedFriendshipID] = useState<{ id_amistad: number | null, nombre_usuario: string, url_avatar: string}>({ id_amistad: null, nombre_usuario: "", url_avatar: "" });
  const handleSelectFriend = (id: number | null, friendName?: string, friendAvatar?: string) => {
    setSelectedFriendshipID({ id_amistad: id, nombre_usuario: friendName || "", url_avatar: friendAvatar || "" });
  };
  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      <div
        className={`
          ${selectedFriendshipID?.id_amistad !== null ? "hidden" : "block"}
          md:block md:w-1/3 lg:border-r-4 lg:border-t-4 border-black overflow-y-auto
        `}
      >
        <FriendList 
          onSelectFriend={handleSelectFriend}
          selectedFriendshipID={selectedFriendshipID.id_amistad} 
        />
      </div>

      <div
        className={`
          ${selectedFriendshipID?.id_amistad !== null ? "block" : "hidden"}
          md:block md:w-2/3 h-full
        `}
      >
        <div className="md:hidden p-2 border-b border-gray-300 bg-white sticky top-0">
          <button
            onClick={() => setSelectedFriendshipID({ id_amistad: null, nombre_usuario: "", url_avatar: "" })}
            className="text-black font-bold font-[Comic_Sans_MS]"
          >
            ← Volver
          </button>
        </div>
        <DirectChat 
          friendshipID={selectedFriendshipID.id_amistad} 
          friendName={selectedFriendshipID.nombre_usuario} 
          friendAvatar={selectedFriendshipID.url_avatar} 
        />
      </div>
    </div>
  );
}

export default DirectMessageView;
