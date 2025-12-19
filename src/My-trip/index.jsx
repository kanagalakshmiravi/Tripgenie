

// My-trip>index.jsx
import { collection, query, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../service/firebaseConfig";
import UserTripCardItems from "./components/UserTripCardItems";
import placeholder from "../assets/placeholder.jpg"; // adjust path if needed




export default function MyTrip() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [heroImage, setHeroImage] = useState(null);


  useEffect(() => {
    GetUserTrip();
  }, []);

  const GetUserTrip = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/");
      return;
    }

    const q = query(collection(db, "AITrips"));
    const querySnapshot = await getDocs(q);

    const trips = [];
    querySnapshot.forEach((doc) => trips.push(doc.data()));
    console.log("Trips fetched from Firestore:", trips);

    setUserTrips(trips);
  };

 function getPlaceName(trip) {
  const address = trip.userSelection?.destination?.address;
  if (!address) return "Unknown place";

  const addrObj = address.toJSON ? address.toJSON() : address;

  // Case 1: display_name exists
  if (addrObj.display_name) {
    return addrObj.display_name;
  }

  // Case 2: build name manually
  const parts = [
    addrObj.county,
    addrObj.state,
    addrObj.country,
  ].filter(Boolean);

  return parts.length ? parts.join(", ") : "Unknown place";
}


  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">MyTrip</h2>

      <div className="grid mt-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 justify-items-center">
        {userTrips.map((trip, index) => (
          <UserTripCardItems
            key={index}
            trip={trip}
            placeName={getPlaceName(trip) }
            imageUrl={trip.heroImage|| placeholder } 
              
          />
        ))}
      </div>
    </div>
  );
}


