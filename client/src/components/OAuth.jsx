import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { signinSuccess } from "../store/user/slice.js";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const googleHandler = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            console.log(result);
            const res = await fetch('/api/auth/google', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({username : result.user.displayName, email: result.user.email, imageURL: result.user.photoURL})
            });
            const data = await res.json();
            dispatch(signinSuccess(data));
            navigate('/profile');
        } catch (error) {
            console.log('Could not login with google', error);
        }
    }

  return <button onClick={googleHandler} type="button" className="my-2 p-2 rounded-lg bg-red-700 text-white uppercase hover:opacity-90 disabled:opacity-70">
    Continue With Google
  </button>;
}
