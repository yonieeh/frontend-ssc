import Navbar from "../components/Navbar";
import DMView from "../components/dmview";
import "./amistades.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Amistades() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    }
  }, []);

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