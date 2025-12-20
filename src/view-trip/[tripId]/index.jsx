
// Viewtrip>index.jsx

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../service/firebaseConfig";
import { normalizeTripData } from "../../utils/normalizeTripData";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

import InfoSection from "../components/InfoSection";
import Hotel from "../components/Hotel";
import PlacesToVisit from "../components/PlacesToVisit";
import Footer from "../components/Footer";

export default function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    if (tripId) {
      GetTripData();
    }
  }, [tripId]);

  const GetTripData = async () => {
    try {
      const docRef = doc(db, "AITrips", tripId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        toast("No trip found!");
        return;
      }

      const rawData = docSnap.data();

      console.log("🔥 RAW FIRESTORE DATA", rawData);

      const normalizedTriData = normalizeTripData(rawData.triData);

      console.log("✅ NORMALIZED DATA", normalizedTriData);

      setTrip({
        id: docSnap.id,
        ...rawData,
        triData: normalizedTriData, // ✅ ALWAYS SAME SHAPE
      });
    } catch (err) {
      console.error("Fetch error:", err);
      toast("Something went wrong");
    }
  };










    return (
        <div className="p-10 md:px-20 lg:px-44 xl:px-56" >

            {/* Information Section */}

           <InfoSection trip={trip} />

            {/* Recommended Hotel */}

            <Hotel trip={trip}/>

            {/* Daily Plan */}

            <PlacesToVisit trip={trip}/>

            {/* Footer */}

           <Footer/>


       </div>
    );
}



//     useEffect(() => {
//         if (tripId) GetTripData();
//     }, [tripId]);

//     const GetTripData = async () => {
//         const docRef = doc(db, "AITrips", tripId);
//         const docSnap = await getDoc(docRef);


//         if (docSnap.exists()) {
//             console.log("Document:", docSnap.data());
//             setTrip({
//   id: docSnap.id,
//   ...docSnap.data()
// }
// );


//         }
//         else {
//             console.log("No such document");
//             toast("No trip found!");
//         }

//     };