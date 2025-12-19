import React, { useEffect, useState } from "react";
import placeholder from "../../assets/placeholder.jpg";

/* ================================
   CLEAN HOTEL NAME FOR WIKIPEDIA
================================ */
function cleanHotelTitle(title) {
  if (!title) return "";
  return title
    .replace(/,\s*.*$/g, "")
    .replace(/\(.*?\)/g, "")
    .replace(/–.*$/g, "")
    .replace(/-.*$/g, "")
    .trim();
}

/* ================================
   PRICE FORMAT HELPER
================================ */
function formatPrice(hotel) {
  if (!hotel) return "N/A";

  // Check EUR first
  if (hotel.pricePerNightEUR) return `${hotel.pricePerNightEUR} €`;
  if (hotel.price_per_night_EUR) return `${hotel.price_per_night_EUR} €`;

  // Check USD
  if (hotel.pricePerNightUSD) return `${hotel.pricePerNightUSD} USD`;
  if (hotel.PricePerNightUSD) return `${hotel.PricePerNightUSD} USD`;
  if (hotel.price_per_night_usd) return `${hotel.price_per_night_usd} USD`;

  return "N/A";
}

/* ================================
   FETCH IMAGE FROM WIKIPEDIA
================================ */
const fetchWikiImage = async (query) => {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(
      query
    )}&gsrlimit=1&prop=pageimages&pithumbsize=600`;

    const res = await fetch(url);
    const data = await res.json();

    const pages = data?.query?.pages;
    if (!pages) return null;

    const page = Object.values(pages)[0];
    return page?.thumbnail?.source || null;
  } catch (err) {
    console.error("Wikipedia Image Error:", err);
    return null;
  }
};

/* ================================
   HOTEL CARD
================================ */
function HotelCard({ hotel }) {
  const initialImage = hotel?.imageUrl || placeholder;
  const [imageUrl, setImageUrl] = useState(initialImage);

  const cleanedName = cleanHotelTitle(hotel?.hotelName || "");

  useEffect(() => {
    const loadImage = async () => {
      if (!cleanedName || hotel?.imageUrl) return;

      const wikiImg = await fetchWikiImage(cleanedName);
      setImageUrl(wikiImg || placeholder);
    };
    loadImage();
  }, [cleanedName, hotel?.imageUrl]);

  return (
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${cleanedName}, ${hotel?.address || "N/A"}`
      )}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="p-3 border rounded-lg bg-white shadow hover:scale-103 transition-all cursor-pointer relative group">
        <img
          src={imageUrl}
          alt={cleanedName || "Hotel"}
          className="rounded-lg w-full h-40 object-cover"
          onError={(e) => (e.target.src = placeholder)}
        />

        <div className="absolute bottom-1/2 right-5 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 bg-black/70 text-white text-xs px-2 py-0.5 rounded transition-all duration-300 ease-in-out">
          May not be real image
        </div>

        <div className="my-2 flex flex-col gap-2">
          <h3 className="font-semibold text-lg text-black">{cleanedName || "Hotel"}</h3>
          <p className="text-gray-600 text-sm">📍 {hotel?.address || "N/A"}</p>
          <h2 className="text-sm">💰 Price: {formatPrice(hotel)}</h2>
          <h2 className="text-sm">⭐ {hotel?.rating || "N/A"}</h2>
        </div>
      </div>
    </a>
  );
}

/* ================================
   HOTEL LIST
================================ */
export default function Hotel({ trip }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trip?.triData) return;

    setLoading(true);

    const hotelArray = trip.triData.hotels || [];

    setHotels(Array.isArray(hotelArray) ? hotelArray : []);
    setLoading(false);
  }, [trip?.id]);

  if (loading)
    return <p className="mt-3 text-gray-500">Loading hotels...</p>;

  if (!hotels.length)
    return <p className="mt-3 text-gray-500">No hotel recommendations available.</p>;

  return (
    <div>
      <h2 className="font-bold text-xl mt-5">Hotel Recommendations</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-3">
        {hotels.map((hotel, index) => (
          <HotelCard key={index} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}





// import React, { useEffect, useState } from "react";
// import placeholder from "../../assets/placeholder.jpg";

// // Fetch image ONLY from Wikipedia
// const fetchWikiImage = async (query) => {
//   try {
//     const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&pithumbsize=500&titles=${encodeURIComponent(
//       query
//     )}`;

//     const res = await fetch(url);
//     const data = await res.json();
//     const pages = data?.query?.pages;
//     const page = pages[Object.keys(pages)[0]];

//     return page?.thumbnail?.source || null;
//   } catch (err) {
//     console.error("Wikipedia Error:", err);
//     return null;
//   }
// };

// function HotelCard({ hotel }) {
//   const [imageUrl, setImageUrl] = useState(placeholder);

//   useEffect(() => {
//     const loadImage = async () => {
//       const query = hotel.hotelName || hotel.hotel_name || hotelOptions.hotelName||"hotel";
//       const wikiImg = await fetchWikiImage(query);
//       if (wikiImg) setImageUrl(wikiImg);
//     };
//     loadImage();
//   }, [hotel]);

//   return (
//     <a
//       href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
//         (hotel.hotelName || hotel.hotel_name || hotelOptions.hotelName|| "") + ", " + (hotel.address || "")
//       )}`}
//       target="_blank"
//       rel="noopener noreferrer"
//     >
//       <div className="p-3 border rounded-lg bg-white shadow hover:scale-102 transition-all cursor-pointer">
//         <img
//           src={imageUrl}
//           alt={hotel.hotelName || hotel.hotel_name || hotelOptions.hotelName|| "hotel"}
//           className="rounded-lg w-full h-40 object-cover"
//           onError={(e) => (e.target.src = placeholder)}
//         />
//         <div className="my-2 flex flex-col gap-2">
//           <h3 className="font-semibold text-lg text-black">
//             {hotel.hotelName || hotel.hotel_name ||  hotelOptions.hotelName||"hotel"}
//           </h3>
//           <p className="text-gray-600 text-sm">📍 {hotel.address}</p>
//           <h2 className="text-sm">💰 {hotel.pricePerNightEUR || "N/A"} € per night</h2>
//           <h2 className="text-sm">⭐ {hotel.rating || "N/A"} stars</h2>
//         </div>
//       </div>
//     </a>
//   );
// }

// export default function Hotel({ trip }) {
//   const hotels =
//     trip?.triData?.hotelOptions ||
//     trip?.triData?.hotels ||
//     [];

//   if (!hotels.length) {
//     return (
//       <p className="mt-3 text-gray-500">
//         No hotel recommendations available.
//       </p>
//     );
//   }

//   return (
//     <div>
//       <h2 className="font-bold text-xl mt-5">Hotel Recommendations</h2>

//       <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-3">
//         {hotels.map((hotel, index) => (
//           <HotelCard key={index} hotel={hotel} />
//         ))}
//       </div>
//     </div>
//   );
// }








































// import React from "react";
// import placeholder from "../../assets/placeholder.jpg";


// export default function Hotel({ trip }) {
//     return (
//         <div >
//             <h2 className="font-bold text-xl mt-5">Hotel Recommendations</h2>

//             <div className="grid grid-cols-2 md:grid-cols-3  xl:grid-cols-4 gap-4 mt-3">
//                 {trip?.triData?.hotels?.map((hotel, index) => (
//                     <a
//                         key={index}
//                         href={`https://www.google.com/maps/search/?api=1&query=${(hotel.hotelName || hotel.hotel_name || "") +
//                             ", " +
//                             (hotel.address || "")
//                             }`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                     >
//                         <div className="p-3 border rounded-lg bg-white shadow hover:scale-102 transition-all cursor-pointer">
//                             <img
//                                 src={placeholder}
//                                 alt="hotel"
//                                 className="rounded-lg w-full h-40 object-cover"
//                             />

//                             <div className="my-2 flex flex-col gap-2">
//                                 <h3 className="font-semibold text-lg text-black">
//                                     {hotel.hotelName || hotel.hotel_name || "Unknown Hotel"}
//                                 </h3>
//                                 <p className="text-gray-600 text-sm">📍{hotel.address}</p>
//                                 <h2 className="text-sm">
//                                     💰 Price: {hotel.pricePerNightEUR || hotel.price_per_night_eur} € per night
//                                 </h2>
//                                 <h2 className="text-sm">⭐ {hotel.rating} stars</h2>
//                             </div>
//                         </div>
//                     </a>
//                 ))}

//             </div>
//         </div>
//     );
// }
