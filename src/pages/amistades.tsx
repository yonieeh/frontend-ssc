import Navbar from "../components/Navbar";
import DMView from "../components/dmview";
import "./amistades.css";

function Amistades() {

  return (
    <div className="flex flex-col h-full w-full" style={{ backgroundImage: "url('/comic.png')" }}>
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <DMView />
      </div>
    </div>
  );
}

export default Amistades;