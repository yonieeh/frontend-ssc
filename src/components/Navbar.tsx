import "../index.css";
import React from "react";

function Navbar() {
  return (
    <nav className="w-full m-0 p-0 flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-2xl font-bold">My App</h1>
      <ul className="flex space-x-4">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  )
}

export default Navbar