import { useEffect, useRef, useState } from "react";
import axios from "../config/axiosconfig";

function Customizer({ onAvatarUpdated }: { onAvatarUpdated: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const image = new Image();
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/usuarios`, 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    ).then(response => {
        const avatarID = response.data.id_avatar;
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/avatares/${avatarID}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`
          },
          responseType: "blob"
        }).then(response => {
          const imageURL = URL.createObjectURL(response.data);
          image.crossOrigin = "anonymous";
          image.src = imageURL;
          image.onload = () => {
            const width = image.naturalWidth;
            const height = image.naturalHeight;

            const scale = Math.min(canvas.width / width, canvas.height / height, 1);
            const scaledWidth = width * scale;
            const scaledHeight = height * scale;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, canvas.width / 2 - scaledWidth / 2, canvas.height / 2 - scaledHeight / 2, scaledWidth, scaledHeight);
            URL.revokeObjectURL(imageURL);
          };
        })
      }).catch(error => {
        console.error("Error fetching avatar:", error);
      })
    .catch(error => {
      console.error("Error fetching avatar:", error);
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let isDrawing = false;

    const getMousePos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    };

    const startDrawing = (e: MouseEvent) => {
      isDrawing = true;
      const { x, y } = getMousePos(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const draw = (e: MouseEvent) => {
      if (!isDrawing) return;
      const { x, y } = getMousePos(e);
      ctx.lineTo(x, y);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.stroke();
    };
    
    const stopDrawing = () => {
      isDrawing = false;
      ctx.closePath();
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      startDrawing({
        clientX: touch.clientX,
        clientY: touch.clientY
      } as MouseEvent);
    }, { passive: false });

    canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      draw({
        clientX: touch.clientX,
        clientY: touch.clientY
      } as MouseEvent);
    }, { passive: false });

    canvas.addEventListener("touchend", (e) => {
      e.preventDefault();
      stopDrawing();
    }, { passive: false });

    canvas.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      stopDrawing();
    }, { passive: false });

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);
      canvas.removeEventListener("touchstart", startDrawing as EventListenerOrEventListenerObject);
      canvas.removeEventListener("touchmove", draw as EventListenerOrEventListenerObject);
      canvas.removeEventListener("touchend", stopDrawing);
      canvas.removeEventListener("touchcancel", stopDrawing);
    };
  }, [color, lineWidth]);

  const handleExport = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataURL = canvas.toDataURL("image/png").split(";base64,")[1];
    try {
      setLoading(true);
      onAvatarUpdated();
      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/avatares`, {
        base64: dataURL
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.status === 200) {
        alert('Avatar actualizado con exito!');
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
    } finally {
      setLoading(false);
    }
      
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      <canvas ref={canvasRef} width={300} height={200} className="border border-black" />
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-row items-center justify-center gap-2 w-full">
          <label className="text-sm">Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <label className="text-sm">Grosor del lápiz:</label>
          <input
            type="range"
            min="1"
            max="10"
            value={lineWidth}
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
          />
        </div>
        {!loading && (
          <button 
            className="px-4 py-1 bg-black text-white hover:bg-white hover:text-black border border-black transition duration-300 ease-in-out"
            onClick={handleExport}
          >
            Actualizar avatar
          </button>
        )}
      </div>
    </div>
  );
}

export default Customizer;