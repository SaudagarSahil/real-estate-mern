import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { useParams } from "react-router-dom";

function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.message === false) {
          setLoading(false);
          setError(true);
          return;
        }
        setListing(data);
        console.log(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <div>
      {loading && (
        <p className="text-center text-3xl font-bold my-5">Loading....</p>
      )}
      {error && (
        <p className="text-center text-3xl font-bold my-5">
          Something went wrong!
        </p>
      )}
      {listing && !loading && !error && (
        <Swiper navigation>
          {listing.imageURLs.map((url) => (
            <SwiperSlide key={url}>
              <div
                className="h-[500px]"
                style={{
                  background: `url(${url}) center no-repeat`,
                  //  backgroundSize : 'cover'
                }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}

export default Listing;
