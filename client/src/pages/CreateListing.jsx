import React, { useState } from "react";
import { app } from "../firebase.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export default function CreateListing() {
  const [files, setfiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "rent",
    regularPrice: 0,
    discountedPrice: 0,
    bedrooms: 1,
    bathrooms: 1,
    offer: false,
    furnished: false,
    parkingSpot: false,
    imageURLs: [],
  });
  console.log(files);
  console.log(formData);

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
      setLoading(true);
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
          setLoading(false);
        })
        .catch((error) => {
          setImageUploadError("Image Upload Failed");
          setLoading(false);
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
      ...formData, imageURLs : formData.imageURLs.filter((_, i) => i != index)
    })
  }

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <main className="max-w-4xl m-auto p-5">
      <h1 className="text-center text-4xl font-semibold">Create a Listing</h1>
      <form className="flex flex-col sm:flex-row p-5">
        <div className="flex flex-col flex-1 p-3">
          <input
            onChange={inputHandler}
            placeholder="name"
            type="text"
            id="name"
            className="my-2 p-4 border rounded-lg"
            required
          />
          <input
            onChange={inputHandler}
            placeholder="description"
            type="textarea"
            id="description"
            className="my-2 p-3 border rounded-lg"
            required
          />
          <input
            onChange={inputHandler}
            placeholder="address"
            type="textarea"
            id="address"
            className="my-2 p-3 border rounded-lg"
            required
          />
          <div className="flex gap-7 flex-wrap">
            <div className="flex gap-2">
              <input onChange={inputHandler} type="checkbox" id="sell" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input onChange={inputHandler} type="checkbox" id="rent" />
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
                <span>(₹ / month)</span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <input
                onChange={inputHandler}
                type="number"
                id="discountedPrice"
                className="border border-slate-500 rounded-lg p-2"
                required
              />
              <div className="flex flex-col">
                <span>Discounted Price</span>
                <span>(₹ / month)</span>
              </div>
            </div>
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
              disabled={loading}
              type="button"
              className="p-3 rounded-lg border border-green-700 bg-green-500"
            >
              {loading? 'uploading...': 'Upload'}
            </button>
          </div>
            {imageUploadError && (
              <div className="text-red-700">{imageUploadError}</div>
            )}
          <div>
            {formData.imageURLs.length !== 0 &&
              formData.imageURLs.map((url, index) => (
                <div key={index} className="flex justify-between border p-2 items-center">
                  <img
                    src={url}
                    alt="List Image"
                    className="object-contain w-20 h-20"
                  />
                  <span onClick={() => imageDeleteHandler(index)} className="border rounded-lg p-2 bg-red-700 hover:cursor-pointer">Delete</span>
                </div>
              ))}
          </div>
          <button className="p-3 rounded-xl border uppercase hover:opacity-90 disabled:opacity-70 border-purple-800 bg-purple-700">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
