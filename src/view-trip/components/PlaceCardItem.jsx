

import React, { useEffect, useState } from "react";
import placeholder from "../../assets/placeholder.jpg";

export default function PlaceCardItem({ place }) {
  const [image, setImage] = useState(placeholder);

  const placeName = place?.placeName || "Tourist Place";

  const randomImage = `https://source.unsplash.com/600x400/?${encodeURIComponent(
    placeName
  )}&sig=${Math.random()}`;

  /* =========================
     FETCH IMAGE FROM WIKIPEDIA
  ========================= */
  useEffect(() => {
    let active = true;

    async function fetchWikiImage() {
      try {
        const searchRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
            placeName
          )}&format=json&origin=*`
        );

        const searchData = await searchRes.json();
        const firstResult = searchData?.query?.search?.[0];

        if (!firstResult) {
          active && setImage(randomImage);
          return;
        }

        const pageRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&pageids=${firstResult.pageid}&prop=pageimages&format=json&pithumbsize=500&origin=*`
        );

        const pageData = await pageRes.json();
        const page = pageData?.query?.pages?.[firstResult.pageid];

        active && setImage(page?.thumbnail?.source || randomImage);
      } catch (err) {
        console.error("Wiki image error:", err);
        active && setImage(randomImage);
      }
    }

    fetchWikiImage();
    return () => (active = false);
  }, [placeName]);

  return (
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        placeName
      )}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="relative group border rounded-xl p-3 flex gap-5 hover:scale-[1.02] transition-all hover:shadow-md cursor-pointer mt-3">
        <img
          src={image}
          alt={placeName}
          onError={() => setImage(placeholder)}
          className="w-[150px] h-[150px] rounded-xl object-cover"
        />

        {/* Image disclaimer */}
         <div className="
    absolute
    bottom-7
    left-5
    opacity-0
    translate-y-1
    group-hover:opacity-100
    group-hover:translate-y-0
    bg-black/70
    text-white
    text-xs
    px-2
    py-1
    rounded
    transition-all
    duration-300
    ease-in-out
  ">
          May not be real image
        </div>

        <div className="flex flex-col ">
          <div>
            <h2 className="font-bold text-lg">{placeName}</h2>

            {place.placeDetails && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-3">
                {place.placeDetails}
              </p>
            )}
          </div>

        {Number.isFinite(place.travelTimeMinutes) && (
  <p className="mt-2 text-sm text-gray-600">
    🕙 {place.travelTimeMinutes} mins
  </p>
          )}
        </div>
      </div>
    </a>
  );
}










































// import React from "react";
// import placeholder from "../../assets/placeholder.jpg";

// export default function PlaceCardItem({ trip }) {
//   if (!place) return null;

//   return (
//     <a
//       href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
//         place.placeName
//       )}`}
//       target="_blank"
//       rel="noopener noreferrer"
//     >
//       <div className="border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer">
//         <img
//           src={place.imageUrl || placeholder}
//           alt={place.placeName}
//           className="w-[150px] h-[150px] rounded-xl object-cover"
//         />

//         <div className="flex flex-col justify-between">
//           <div>
//             <h2 className="font-bold text-lg">{place.placeName}</h2>

//             <p className="text-sm text-gray-400">
//               {place.placeDetails}
//             </p>
//           </div>

//           {/* Travel Info */}
//           {place.travelTimeMinutes !== null ||
//           place.travelMode !== null ? (
//             <h2 className="mt-2 flex items-center gap-2 text-sm text-gray-600">
//               🕙
//               {place.travelTimeMinutes !== null && (
//                 <span>{trip.travelTimeMinutes} min</span>
//               )}
//               {place.travelMode && (
//                 <span> by {place.travelMode}</span>
//               )}
//             </h2>
//           ) : (
//             <h2 className="mt-2 flex items-center gap-2 text-sm text-gray-600">
//               🕙 <span>On-site / No travel needed</span>
//             </h2>
//           )}
//         </div>
//       </div>
//     </a>
//   );
// }




























// import React from 'react'
// import placeholder from "../../assets/placeholder.jpg"
// import { FaMapLocationDot } from "react-icons/fa6";
// import { Button } from "@/components/ui/button"



// export default function PlaceCardItem({place}) {
//   return (
//     <a
//      href={`https://www.google.com/maps/search/?api=1&query=${(place.placeName ) }`}target="_blank">
//         <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-103 transition-all hover:shadow-md cursor-pointer' >

//             <img src={placeholder} alt="#"
//             className='w-[150px] h-[150px] rounded-xl'/>

//             <div>

//                 <h2 className='font-bold text-lg'>{place.placeName||place.place_name}</h2>
//                 <p className='text-sm text-gray-400'>{place.details}</p>
//                 <h2 className='mt-2'>🕙{place.travelTimeFromPrevious?.replace("≈", "")||place.travelTimeMinutes||place.travel_time_from_previous_min} Mins</h2>
//                 {/* <Button className='sm  cursor-pointer'><FaMapLocationDot /></Button> */}

//             </div>
//         </div>
//     </a>
//   )
// }





// import React, { useEffect, useState } from "react";
// import placeholder from "../../assets/placeholder.jpg";

// export default function PlaceCardItem({ place }) {
//   const [image, setImage] = useState(placeholder);

//   const placeName =
//     place?.placeName || place?.place_name || "tourist place";

//   // 🔹 Random image fallback
//   const randomImage = `https://source.unsplash.com/600x400/?${encodeURIComponent(
//     placeName
//   )}&sig=${Math.random()}`;

//   /* ----------------------------------------
//      WIKIPEDIA SEARCH → IMAGE
//   ---------------------------------------- */
//   useEffect(() => {
//     let active = true;

//     async function fetchWikiImage() {
//       try {
//         // 1️⃣ SEARCH PAGE
//         const searchRes = await fetch(
//           `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
//             placeName
//           )}&format=json&origin=*`
//         );

//         const searchData = await searchRes.json();
//         const firstResult = searchData?.query?.search?.[0];

//         if (!firstResult) {
//           if (active) setImage(randomImage);
//           return;
//         }

//         // 2️⃣ FETCH IMAGE USING PAGEID
//         const pageRes = await fetch(
//           `https://en.wikipedia.org/w/api.php?action=query&pageids=${firstResult.pageid}&prop=pageimages&format=json&pithumbsize=500&origin=*`
//         );

//         const pageData = await pageRes.json();
//         const page =
//           pageData?.query?.pages?.[firstResult.pageid];

//         if (page?.thumbnail?.source && active) {
//           setImage(page.thumbnail.source);
//         } else if (active) {
//           setImage(randomImage);
//         }
//       } catch (err) {
//         console.error("Wiki image error:", err);
//         if (active) setImage(randomImage);
//       }
//     }

//     fetchWikiImage();
//     return () => (active = false);
//   }, [placeName]);

//   return (
//     <a
//     href={`https://www.google.com/maps/search/?api=1&query=${(place.placeName ) }`}target="_blank">
//    <div className="relative group border rounded-xl p-3 mt-2 flex gap-5 hover:scale-103 transition-all hover:shadow-md cursor-pointer">
  
//   <img
//     src={image}
//     alt={placeName}
//     onError={() => setImage(placeholder)}
//     className="w-[150px] h-[150px] rounded-xl object-cover"
//   />

//   {/* ⚠️ IMAGE DISCLAIMER BADGE */}
//   <div className="
//     absolute
//     bottom-7
//     left-5
//     opacity-0
//     translate-y-1
//     group-hover:opacity-100
//     group-hover:translate-y-0
//     bg-black/70
//     text-white
//     text-xs
//     px-2
//     py-1
//     rounded
//     transition-all
//     duration-300
//     ease-in-out
//   ">
//     May not be real image
//   </div>

//         <div>

//                  <h2 className='font-bold text-lg'>{place.placeName||place.place_name}</h2>
//                  <p className='text-sm text-gray-400'>{place.details}</p>
//              <h2 className='mt-2'>🕙{place.travelTimeFromPrevious?.replace("≈", "")||place.travelTimeMinutes||place.travel_time_from_previous_min} Mins</h2>
//              {/* <Button className='sm  cursor-pointer'><FaMapLocationDot /></Button> */}
//            </div>
//     </div>
//      </a>
//   );
// }
