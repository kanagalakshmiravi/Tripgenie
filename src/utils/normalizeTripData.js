// src/utils/normalizeTripData.js

// src/utils/normalizeTripData.js

export function normalizeTripData(data) {
  if (!data) return {};

  /* =====================
     HELPER TO EXTRACT MINUTES
  ===================== */
  const extractMinutes = (str) => {
    if (!str) return null;
    const match = str.match(/(\d+)\s*min/);
    return match ? parseInt(match[1], 10) : 0; // 0 for on-site/0 min
  };

  /* =====================
     NORMALIZE HOTELS
  ===================== */
  const hotels = (data.hotelOptions || data.Hotels || data.hotels || data.HotelOptions || []).map(
    (hotel) => ({
      hotelName:
        hotel.hotelName ||
        hotel.HotelName ||
        hotel.name ||
        hotel.hotel_name ||
        "",
      address: hotel.address || hotel.Address || "",
      rating: hotel.rating || hotel.Rating || "N/A",
      pricePerNightUSD:
        hotel.pricePerNightUSD ||
        hotel.PricePerNightUSD ||
        hotel.price_per_night_usd ||
        "N/A",
      description:
        hotel.description ||
        hotel.Description ||
        hotel.PlaceDetails ||
        "",
      imageUrl: hotel.imageurl || hotel.ImageUrl || hotel.imageUrl || "",
    })
  );

  /* =====================
     NORMALIZE ITINERARY
  ===================== */
  const normalizedItinerary = {};
  const rawItinerary = data.itinerary || data.Itinerary || [];

  if (Array.isArray(rawItinerary)) {
    rawItinerary.forEach((dayObj, index) => {
      const dayNumber = dayObj.day || dayObj.Day || index + 1;
      const dayKey = `day${dayNumber}`;

      normalizedItinerary[dayKey] = {
        date: dayObj.date || "",
        activities: (dayObj.activities || dayObj.Activities || dayObj.Plan || []).map((place) => ({
          placeName: place.placeName || place.PlaceName || "",
          placeDetails: place.placeDetails || place.PlaceDetails || place.details || place.Details || "",
          imageUrl: place.placeImageUrl || place.PlaceImageURL || place.ImageURL || "",
          bestVisitTime: place.bestVisitTime || place.BestVisitTime || place.bestTimeToVisit || dayObj.BestTimeToVisit || "",
          ticketPricing: place.ticketPricing || place.TicketPricing || place.TicketPricingINR || "N/A",
          geoCoordinates: place.geoCoordinates || place.GeoCoordinates || null,
          travelTimeMinutes: extractMinutes(place.travelTimeFromPrevious || place.TravelTimeFromPrevious),
        })),
      };
    });
  } else {
    // AI-style object
    Object.entries(rawItinerary).forEach(([dayKey, day]) => {
      normalizedItinerary[dayKey] = {
        theme: day.Theme || "",
        activities: (day.activities || []).map((place) => ({
          placeName: place.placeName || "",
          placeDetails: place.placeDetails || "",
          imageUrl: place.imageUrl || "",
          bestVisitTime: place.bestVisitTime || place.bestTimeToVisit || "",
          ticketPricing: place.ticketPricing || place.ticketPriceUSD || "N/A",
          geoCoordinates: place.geoCoordinates || null,
          travelTimeMinutes: place.travelTimeMinutes ?? null,
        })),
      };
    });
  }

  /* =====================
     RETURN NORMALIZED DATA
  ===================== */
  return {
    destination: data.destination || data.Destination || "",
    budgetLevel: data.budgetLevel || data.BudgetLevel || "Moderate",
    travelers: data.travelers || data.Travelers || { adults: 1, children: 0 },
    tripLengthDays: Number(data.tripLengthDays || data.TravelDays || data.noOfDays || 1),
    hotels,
    itinerary: normalizedItinerary,
  };
}


// export function normalizeTripData(data) {
//   if (!data) return {};

//   /* =====================
//      NORMALIZE HOTELS
//   ===================== */
//   const hotels = (data.hotelOptions || data.Hotels || data.hotels || []).map(
//     (hotel) => ({
//       hotelName:
//         hotel.hotelName ||
//         hotel.HotelName ||
//         hotel.name ||
//         hotel.hotel_name ||
//         "",
//       address: hotel.address || hotel.Address || "",
//       rating: hotel.rating || hotel.Rating || "N/A",
//       pricePerNightUSD:
//         hotel.pricePerNightUSD ||
//         hotel.PricePerNightUSD ||
//         hotel.price_per_night_usd ||
//         "N/A",
//       description:
//         hotel.description ||
//         hotel.Description ||
//         hotel.PlaceDetails ||
//         "",
//       imageUrl: hotel.imageUrl || hotel.ImageUrl || "",
//     })
//   );

//   /* =====================
//      🔥 NORMALIZE ITINERARY (FIXED)
//   ===================== */
//   const normalizedItinerary = {};
//   const rawItinerary = data.itinerary || data.Itinerary || [];

//   rawItinerary.forEach((day) => {
//     const dayKey = `day${day.Day}`;

//     normalizedItinerary[dayKey] = {
//       theme: day.Theme || "",
//       activities: (day.Activities || []).map((place) => ({
//         placeName:
//           place.PlaceName ||
//           place.placeName ||
//           "",

//         placeDetails:
//   place.placeDetails ||
//   place.PlaceDetails ||
//   place.Description ||
//   "",


//         imageUrl:
//           place.PlaceImageURL ||
//           place.imageUrl ||
//           "",

//         bestVisitTime:
//           place.BestVisitTime ||
//           place.bestVisitTime ||
//           place.best_time_to_visit ||
          
//           "",

//         ticketPriceUSD:
//           place.TicketPricingUSD ||
//           place.ticketPriceUSD ||
//           null,

//         geoCoordinates:
//           place.GeoCoordinates ||
//           place.geoCoordinates ||
//           null,

//         // ✅ IMPORTANT FIX (STANDARD KEY)
//         travelTimeMinutes:
//           place.TravelTimeFromHotelMin ||
//           place.TravelTimeFromPreviousMin ||
//           place.travelTimeMinutes ||
//           place.traveltimeMinutes||
//           place.travel_time_from_previous_min||
//           null,
//       })),
//     };
//   });

//   /* =====================
//      RETURN CLEAN DATA
//   ===================== */
//   return {
//     destination: data.destination || data.Destination || "",
//     budgetLevel: data.budgetLevel || data.BudgetLevel || "Moderate",
//     travelers:
//       data.travelers || data.Travelers || { adults: 1, children: 0 },
//     tripLengthDays: Number(
//       data.tripLengthDays || data.TravelDays || data.noOfDays || 1
//     ),

//     hotels,
//     itinerary: normalizedItinerary, // ✅ UI READY
//   };
// }


// export function normalizeTripData(data) {
//   if (!data) return {};

//   const hotels = (data.hotelOptions || data.Hotels || data.hotels || []).map(
//     (hotel) => ({
//       hotelName: hotel.hotelName || hotel.HotelName || hotel.name || hotel.hotel_name|| "",
//       address: hotel.address || hotel.Address || "",
//       rating: hotel.rating || hotel.Rating || "N/A",
//       pricePerNightUSD:
//         hotel.pricePerNightUSD || hotel.PricePerNightUSD || "N/A",
//       description: hotel.description || hotel.Description || "",
//       imageUrl: hotel.imageUrl || hotel.ImageUrl || "",
//     })
//   );

//   const itinerary = data.itinerary || data.Itinerary || [];
//   const travelers = data.travelers || data.Travelers || { adults: 1, children: 0 };

//   return {
//     destination: data.destination || data.Destination || "",
//     budgetLevel: data.budgetLevel || data.BudgetLevel || "Moderate",
//     hotels,
//     itinerary,
//     travelers,
//     tripLengthDays: Number(data.tripLengthDays || data.TravelDays || data.noOfDays || 1),
//   };
// }
