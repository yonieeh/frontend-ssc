import { useState } from "react";
import FriendList from "./friendlist";
import DirectChat from "./directchat";

function DirectMessageView() {
  const [selectedFriendshipID, setSelectedFriendshipID] = useState<number | null>(null);

  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      <div
        className={`
          ${selectedFriendshipID ? "hidden" : "block"}
          md:block md:w-1/3 border-r border-gray-300 overflow-y-auto
        `}
      >
        <FriendList onSelectFriend={setSelectedFriendshipID} />
      </div>

      <div
        className={`
          ${selectedFriendshipID ? "block" : "hidden"}
          md:block md:w-2/3 h-full
        `}
      >
        <div className="md:hidden p-2 border-b border-gray-300 bg-white sticky top-0">
          <button
            onClick={() => setSelectedFriendshipID(null)}
            className="text-black font-bold"
          >
            ← Volver
          </button>
        </div>
        <DirectChat friendshipID={selectedFriendshipID} />
      </div>
    </div>
  );
}

export default DirectMessageView;
