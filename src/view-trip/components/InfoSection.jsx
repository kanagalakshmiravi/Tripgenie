// InfoSection.jsx
import React, { useEffect, useState } from "react";
import placeholder from "../../assets/placeholder.jpg";
import { IoIosSend } from "react-icons/io";
import { Button } from "@/components/ui/button";

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
  const UNSPLASH_ACCESS_KEY = "Cr4bvcHk9zz4fBsdL_aDgaMB2gmLJLO1TOQBojt9HFA"; // Replace with your key
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

export default function InfoSection({ trip , }) {
  const [imageUrl, setImageUrl] = useState(placeholder);
  const [loading, setLoading] = useState(true);

  const rawDestination = trip?.userSelection?.destination?.display_name;
  const cleanedTitle = cleanTitle(rawDestination);

  useEffect(() => {
    if (!cleanedTitle) return;

    const fetchImage = async () => {
      setLoading(true);

      // 1️⃣ Try Wikipedia
      try {
        const wikiApi = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&pithumbsize=1600&titles=${encodeURIComponent(cleanedTitle)}`;
        const res = await fetch(wikiApi);
        const data = await res.json();
        const pages = data?.query?.pages;
        const page = pages[Object.keys(pages)[0]];
        const wikiImg = page?.thumbnail?.source;

        if (wikiImg) {
          setImageUrl(wikiImg);
          return;
        }
      } catch (err) {
        console.error("Wikipedia error:", err);
      }

      // 2️⃣ Fallback to Unsplash
      const unsplashImg = await fetchUnsplashImage(cleanedTitle);
      if (unsplashImg) {
        setImageUrl(unsplashImg);
      } else {
        setImageUrl(placeholder); // Final fallback
      }

      setLoading(false);
    };

    fetchImage();
  }, [cleanedTitle]);

  return (
    <div >
      {loading && <p className="text-gray-400 mb-2">Loading image...</p>}

      <img
        src={imageUrl}
        alt={rawDestination}
        className="h-[350px] w-full object-cover rounded-xl img-fluid shadow-sm "
        onLoad={() => setLoading(false)}     // ✅ image loaded, hide loading text
        onError={(e) => {
          e.target.src = placeholder;      // ✅ fallback image
          setLoading(false);               // hide loading text
        }}
      />
      <div className="flex justify-between items-center">
        <div className="my-5 flex flex-col gap-2">
          <h2 className="font-bold text-2xl">{rawDestination}</h2>

          <div className="flex gap-5">
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              📆 {trip?.userSelection?.noOfDays} Day
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              💰 {trip?.userSelection?.budget} Budget
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              🧑‍🤝‍🧑 Travelers: {trip?.userSelection?.people}
            </h2>
          </div>
        </div>

        <Button>
          <IoIosSend />
        </Button>
      </div>
    </div>
  );
}





















// import React from 'react'
// import placeholder from "../../assets/placeholder.jpg"
// import { IoIosSend } from "react-icons/io";
// import { Button } from "@/components/ui/button"

// export default function InfoSection({trip}) {
//   return (
//     <div >
//         <img src={placeholder} className='h-[350px] w-full object-cover rounded-xl' />
        
//         <div className='flex justify-between items-center'>
//           <div className='my-5 flex flex-col gap-2' >
//               <h2 className='font-bold text-2xl ' >{trip?.userSelection?.destination?.display_name}</h2>
//             <div className='flex gap-5'>
//               <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500  text-xs md:text-md'>📆{trip?.userSelection?.noOfDays} Day</h2>
//               <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>💰{trip?.userSelection?.budget} Budget</h2>
//               <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>🧑‍🤝‍🧑 No. Of Traveler: {trip?.userSelection?.people} Day</h2>
//             </div>

//           </div>
          
//         <Button><IoIosSend /></Button>
//         </div>
//     </div>
//   )
// }
