import React, { useEffect, useState } from "react";
import { app } from "../firebase.js";
import { useSelector } from 'react-redux';
import {useNavigate, useParams } from 'react-router-dom';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export default function UpdateListing() {
  const [files, setfiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "rent",
    regularPrice: 0,
    discountedPrice : '',
    bedrooms: 1,
    bathrooms: 1,
    offer: false,
    furnished: false,
    parkingSpot: false,
    imageURLs: [],
  });
  console.log(files);
  console.log(formData);

  const {currentUser} = useSelector(state => state.user);
  const navigate = useNavigate();
  
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const listingId = params.listingId;
      console.log(listingId);
      try {
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        if(data.success == false) {
          console.log(data.message);
          return;
        }
        setFormData(data);
      } catch(error) {
        console.log(error);
      }
    }
    fetchData();
  }, [])

  const inputHandler = (e) => {
    if (e.target.id === "sell" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.type === "text" ||
      e.target.type === "textarea" ||
      e.target.type === "number"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
    if (
      e.target.id === "parkingSpot" ||
      e.target.id === "offer" ||
      e.target.id === "furnished"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
  };

  const imageUploadHandler = (e) => {
    if (files.length > 0 && files.length + formData.imageURLs.length < 7) {
      setImageUploadLoading(true);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageURLs: formData.imageURLs.concat(urls),
          });
          setImageUploadError(null);
          // console.log("all promises done");
          setImageUploadLoading(false);
        })
        .catch((error) => {
          setImageUploadError("Image Upload Failed");
          setImageUploadLoading(false);
        });
    } else {
      setImageUploadError("Only 6 images allowed per Listing");
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress} done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const imageDeleteHandler = (index) => {
    setFormData({
      ...formData,
      imageURLs: formData.imageURLs.filter((_, i) => i != index),
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if(formData.imageURLs.length < 1) return setError("At least 1 image should be uploaded");
      setError(false);
      setLoading(true);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef : currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate(`/listing/${currentUser._id}`);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <main className="max-w-4xl m-auto p-5">
      <h1 className="text-center text-4xl font-semibold">Update Listing</h1>
      <form onSubmit={submitHandler} className="flex flex-col sm:flex-row p-5">
        <div className="flex flex-col flex-1 p-3">
          <input
            onChange={inputHandler}
            value={formData.name}
            placeholder="name"
            type="text"
            id="name"
            className="my-2 p-4 border rounded-lg"
            required
          />
          <input
            onChange={inputHandler}
            value={formData.description}
            placeholder="description"
            type="textarea"
            id="description"
            className="my-2 p-3 border rounded-lg"
            required
          />
          <input
            onChange={inputHandler}
            value={formData.address}
            placeholder="address"
            type="textarea"
            id="address"
            className="my-2 p-3 border rounded-lg"
            required
          />
          <div className="flex gap-7 flex-wrap">
            <div className="flex gap-2">
              <input onChange={inputHandler} type="checkbox" checked={formData.type === 'sell'} id="sell" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input onChange={inputHandler} type="checkbox" checked={formData.type === 'rent'} id="rent" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input onChange={inputHandler} type="checkbox" id="parkingSpot" />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input onChange={inputHandler} type="checkbox" id="furnished" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input onChange={inputHandler} type="checkbox" id="offer" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 items-center">
              <input
                onChange={inputHandler}
                type="number"
                id="bedrooms"
                className="border border-slate-500 rounded-lg p-2"
                defaultValue={1}
                min={1}
                max={10}
                required
              />
              <span>Beds</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                onChange={inputHandler}
                type="number"
                id="bathrooms"
                className="border border-slate-500 rounded-lg p-2"
                defaultValue={1}
                min={1}
                max={10}
                required
              />
              <span>Baths</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                onChange={inputHandler}
                type="number"
                id="regularPrice"
                className="border border-slate-500 rounded-lg p-2"
                required
              />
              <div className="flex flex-col">
                <span>Regular Price</span>
                <span hidden={formData.type === 'sell'}>(₹ / month)</span>
              </div>
            </div>
            {formData.offer && <div className="flex gap-2 items-center">
              <input
                onChange={inputHandler}
                type="number"
                id="discountedPrice"
                className="border border-slate-500 rounded-lg p-2"
                required
                max={formData.regularPrice - 1}
              />
              <div className="flex flex-col">
                <span>Discounted Price</span>
                <span hidden={formData.type === 'sell'}>(₹ / month)</span>
              </div>
            </div> }
          </div>
        </div>
        <div className="flex gap-5 flex-col flex-1 p-3">
          <div className="flex gap-5">
            <input
              onChange={(e) => setfiles(e.target.files)}
              multiple
              accept="image/*"
              className="p-3 border border-slate-500 bg-white rounded-xl"
              type="file"
            />
            <button
              onClick={imageUploadHandler}
              disabled={imageUploadLoading}
              type="button"
              className="p-3 rounded-lg border border-green-700 bg-green-500"
            >
              {imageUploadLoading ? "uploading..." : "Upload"}
            </button>
          </div>
          {imageUploadError && (
            <div className="text-red-700">{imageUploadError}</div>
          )}
          <div>
            {formData.imageURLs.length !== 0 &&
              formData.imageURLs.map((url, index) => (
                <div
                  key={index}
                  className="flex justify-between border p-2 items-center"
                >
                  <img
                    src={url}
                    alt="List Image"
                    className="object-contain w-20 h-20"
                  />
                  <span
                    onClick={() => imageDeleteHandler(index)}
                    type="button"
                    className="border rounded-lg p-2 bg-red-700 hover:cursor-pointer"
                  >
                    Delete
                  </span>
                </div>
              ))}
          </div>
          <button
            disabled={loading}
            button="submit"
            className="p-3 rounded-xl border uppercase hover:opacity-90 disabled:opacity-70 border-purple-800 bg-purple-700"
          >
            {loading ? "Updating..." : "Update Listing"}
          </button>
        </div>
      </form>
      <div className="text-center text-red-700">{error &&  error}</div>
    </main>
  );
}