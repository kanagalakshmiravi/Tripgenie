// My-trip>components>UserTripCardItems

import React, { useEffect, useState } from "react";
import placeholder from "../../assets/placeholder.jpg";
import { IoIosSend } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../service/firebaseConfig";

// 🧹 CLEAN THE TITLE for Wikipedia
function cleanTitle(title) {
  if (!title) return "";
  return title
    .replace(/,\s*(Italy|India|Australia|France|Germany|United States|USA|Canada|United Kingdom)$/gi, "")
    .replace(/\(.*?\)/g, "")
    .replace(/–.*/g, "")
    .replace(/-.*/g, "")
    .replace(/Dinner|Lunch|Breakfast|Afternoon Tea|Evening Stroll/gi, "")
    .trim();
}

// Unsplash fallback function
const fetchUnsplashImage = async (query) => {
  const UNSPLASH_ACCESS_KEY = "Cr4bvcHk9zz4fBsdL_aDgaMB2gmLJLO1TOQBojt9HFA";
  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    const data = await res.json();
    return data?.urls?.regular;
  } catch (err) {
    console.error("Unsplash error:", err);
    return null;
  }
};

export default function InfoSection({ trip, setHeroImage , placeName,}) {
  const [imageUrl, setImageUrl] = useState(placeholder);
  const [loading, setLoading] = useState(true);
  const tripId = trip?.id;

  const rawDestination = trip?.userSelection?.destination?.display_name;
  const cleanedTitle = cleanTitle(rawDestination);

  useEffect(() => {
    if (!cleanedTitle || !tripId) return;

    const fetchImage = async () => {
      setLoading(true);

      try {
        // 1️⃣ Wikipedia
        const wikiApi = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&pithumbsize=1600&titles=${encodeURIComponent(cleanedTitle)}`;
        const res = await fetch(wikiApi);
        const data = await res.json();
        const pages = data?.query?.pages;
        const page = pages[Object.keys(pages)[0]];
        const wikiImg = page?.thumbnail?.source;

        if (wikiImg) {
          setImageUrl(wikiImg);
          setHeroImage?.(wikiImg); // optional
          // await updateDoc(doc(db, "AITrips", tripId), { heroImage: wikiImg });
          // console.log("✅ Hero image saved (wiki):", wikiImg);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Wikipedia error:", err);
      }

      try {
        // 2️⃣ Unsplash fallback
        const unsplashImg = await fetchUnsplashImage(cleanedTitle);
        if (unsplashImg) {
          setImageUrl(unsplashImg);
          setHeroImage?.(unsplashImg); // optional
          // await updateDoc(doc(db, "AITrips", tripId), { heroImage: unsplashImg });
          // console.log("✅ Hero image saved (unsplash):", unsplashImg);
        } else {
          setImageUrl(placeholder);
          setHeroImage?.(placeholder);
        }
      } catch (err) {
        console.error("Unsplash fetch failed:", err);
        setImageUrl(placeholder);
        setHeroImage?.(placeholder);
      }

      setLoading(false);
    };

    fetchImage();
  }, [cleanedTitle, tripId, setHeroImage]);

  return (
    <a href={`/view-trip/${trip.id}`}>
    <div className="border p-2 rounded-lg ">
      {loading && <p className="text-gray-400 mb-2">Loading image...</p>}

      <img
        src={imageUrl}
        alt={rawDestination}
        className="h-[150px] w-full object-cover rounded-xl img-fluid shadow-sm"
        onError={(e) => (e.target.src = placeholder)}
      />

       <h2 className="font-bold text-l mt-1">{placeName}</h2>

      
      <h2 className="text-sm text-gray-500 mt-1 mb-3 "> {trip.userSelection?.noOfDays}Days Trip with {trip.userSelection?.budget} Budget</h2>
    </div>
    </a>
  );
}

// import React from "react";
// import placeholder from "../../assets/placeholder.jpg";

// export default function UserTripCardItems({ trip, placeName,imageUrl  }) {

//   console.log(trip.userSelection);
// console.log(trip.userSelection?.destination?.address);
// console.log("Received image:", imageUrl);



//   return (
//     <div className="border p-2 rounded-lg max-w-[240px]">
       
//       <img
//         src={imageUrl || placeholder} // ✅ use fetched image if available
//         alt={placeName}
//         className="w-full mb-3 h-36 object-cover rounded-lg"
//       />

//       <h2 className="font-bold text-l mt-1">{placeName}</h2>

      
//       <h2 className="text-sm text-gray-500 mt-1 mb-3 "> {trip.userSelection?.noOfDays}Days Trip with {trip.userSelection?.budget} Budget</h2>
      
//     </div>
//   );
// }

