import Navbar from "../components/Navbar";
import CrearSalaForm from "../components/createchatForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CreateChat () {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col h-screen w-full" style={{ backgroundImage: "url('/comic.png')" }}>
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="flex flex-1 justify-center items-center px-4">
        <div className="w-500 max-w-md">
          <CrearSalaForm />
        </div>
      </div>
    </div>
  );
}
export default CreateChat