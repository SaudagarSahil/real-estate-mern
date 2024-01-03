import React from "react";
import { Link } from "react-router-dom";
import Home from "../pages/Home";

export default function Header() {
  return <header className="bg-slate-200">
    <div className="flex justify-between p-3 items-center">
    <Link to="/">
        <h1 className="font-bold flex text-md sm:text-lg">
            <span className="text-slate-800">Sahil</span>
            <span className="text-slate-500">Estate</span>
        </h1>
    </Link>
    <form className="bg-slate-100 rounded-lg p-3 flex items">
        <input type="text" className="bg-transparent focus:outline-none" placeholder="Search . . . ." />
    </form>
    <ul className="flex gap-3">
        <Link to="/"><li className="hidden sm:inline hover:underline">Home</li></Link>
        <Link to="/about"><li className="hidden sm:inline hover:underline">about</li></Link>
        <Link to="/sign-in"><li className="hover:underline">Logout</li></Link>
    </ul>
    </div>
  </header>;
}
