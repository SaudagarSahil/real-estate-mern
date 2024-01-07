import React, { useState } from "react";
import { Link }from "react-router-dom";

export default function SignUp() {
  const [data, setData] = useState({});
  const inputHandler = (e) => {
    setData({
      ...data,
      [e.target.id] : e.target.value,
    })
  }
  const submitHandler = (e) => {
    e.preventDefault();
  }
  console.log(data);
  return (
    <div className="my-5 p-5 max-w-lg m-auto">
      <div className="font-semibold text-center text-3xl">Sign Up</div>
      <form onSubmit={submitHandler} className="flex flex-col p-5 mt-5">
        <input
          onChange={inputHandler}
          placeholder="username"
          type="text"
          id="username"
          className="my-2 p-3 border rounded-lg"
        />
        <input
          onChange={inputHandler}
          placeholder="email"
          type="text"
          id="email"
          className="my-2 p-3 border rounded-lg"
        />
        <input
          onChange={inputHandler}
          placeholder="password"
          type="password"
          id="password"
          className="my-2 p-3 border rounded-lg"
        />
        <button className="my-2 p-2 rounded-lg bg-slate-600 text-white uppercase hover:opacity-90 disabled:opacity-70">Sign Up</button>
        <button className="my-2 p-2 rounded-lg bg-slate-600 text-white uppercase hover:opacity-90 disabled:opacity-70">Sign Up with Google</button>
      </form>
      <div className="flex gap-3 justify-center">
        <p>Already have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
    </div>
  );
}
