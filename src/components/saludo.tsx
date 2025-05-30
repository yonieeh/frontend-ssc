import { useEffect, useState } from "react";

export function Greeting() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const day = new Date();
    const currentHour = day.getHours();
    let greeting = "";

    if (currentHour >= 6 && currentHour < 12) {
      greeting = "¡Buenos días!";
    } else if (currentHour >= 12 && currentHour < 18) {
      greeting = "¡Buenas tardes!";
    } else {
      greeting = "¡Buenas noches!";
    }

    setMessage(`${greeting} ¡Bienvenido a Stickman Sigma Chat!.`);
  }, []);

  return <h2 id="subtitle" className="text-2xl md:text-3xl font-bold font-[Comic_Neue]">{message}</h2>;
}