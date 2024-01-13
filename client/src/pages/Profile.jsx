import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({});
  const [fileUploadError, setFileUploadError] = useState(null);
  const navigate = useNavigate();
  const fileRef = useRef(null);
  console.log(file);
  console.log(filePerc);
  console.log(formData);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const process = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(process));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  return (
    <div className="my-5 max-w-lg m-auto">
      <div className="font-semibold text-center text-3xl">Profile</div>
      <form className="flex flex-col p-5">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          className="w-20 h-20 object-cover cursor-pointer self-center rounded-full"
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="Profile-Pic"
        />
        <p className="self-center">
          {fileUploadError ? (
            <span>Error Image Upload</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span>{`uploading ${filePerc}%`}</span>
          ) : filePerc == 100 ? (
            <span>Success</span>
          ) : (
            ""
          )}
        </p>
        <div className="my-2 p-2 rounded-lg bg-purple-200 text-red">
          {currentUser.username}
        </div>
        <div className="my-2 p-2 rounded-lg bg-purple-200 text-red">
          {currentUser.email}
        </div>
        <button className="my-2 p-2 rounded-lg bg-slate-600 text-white uppercase hover:opacity-90 disabled:opacity-70">
          Update
        </button>
        {/* <button className="my-2 p-2 rounded-lg bg-slate-600 text-white uppercase hover:opacity-90 disabled:opacity-70">
          Create Shifting
        </button> */}
        <div className="flex justify-between">
          <span className="cursor-pointer text-red-600">Delete Account</span>
          <span
            className="cursor-pointer text-red-600"
            onClick={() => {
              navigate("/sign-in");
            }}
          >
            Sign Out
          </span>
        </div>
      </form>
      {/* {error && <p className="text-center text-red-500">{error}</p>} */}
    </div>
  );
}
