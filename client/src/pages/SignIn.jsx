import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { signinFail, signinStart, signinSuccess } from "../store/user/slice.js";
import OAuth from "../components/OAuth.jsx";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {error, loading} = useSelector((state) => state.user);

  const inputHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(signinStart());
      const res = await fetch("/api/auth/signin", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if(data.success === false) {
        dispatch(signinFail(data.message));
        return;
      }
      console.log(data);
      dispatch(signinSuccess(data));
      navigate('/profile');
    } catch (error) {
      dispatch(signinFail(error.message));
      // console.log(error);
    }
  };

  console.log(formData);
  return (
    <div className="my-5 p-5 max-w-lg m-auto">
      <div className="font-semibold text-center text-3xl">Sign In</div>
      <form onSubmit={submitHandler} className="flex flex-col p-5 mt-5">
        <input
          onChange={inputHandler}
          placeholder="email"
          type="text"
          id="email"
          required
          className="my-2 p-3 border rounded-lg"
        />
        <input
          onChange={inputHandler}
          placeholder="password"
          type="password"
          id="password"
          required
          className="my-2 p-3 border rounded-lg"
        />
        <button
          disabled={loading}
          className="my-2 p-2 rounded-lg bg-slate-600 text-white uppercase hover:opacity-90 disabled:opacity-70"
        >
          {loading ? "loading......" : "Sign In"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 justify-center">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-center text-red-500">{error}</p>}
    </div>
  );
}
