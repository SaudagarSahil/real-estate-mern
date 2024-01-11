import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const {currentUser} = useSelector((state) => state.user);
  console.log(currentUser);

  return (
    <header className="bg-slate-200">
      <div className="flex justify-between p-3 items-center">
        <Link to="/">
          <h1 className="font-bold flex text-md sm:text-lg">
            <span className="text-slate-800">Sahil</span>
            <span className="text-slate-500">Estate</span>
          </h1>
        </Link>
        <form className="bg-slate-100 rounded-lg p-3 flex items">
          <input
            type="text"
            className="bg-transparent focus:outline-none"
            placeholder="Search . . . ."
          />
        </form>
        <ul className="flex gap-3">
          <Link to="/">
            <li className="hidden sm:inline hover:underline">Home</li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline hover:underline">about</li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img className="w-8 h-8 rounded-full object-cover" src={currentUser.avatar} alt='Profile-Pic'/>
            ) : (
              <li className="hover:underline">Signin</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
