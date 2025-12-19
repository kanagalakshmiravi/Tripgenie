import React, { useState } from "react";
import { SelectTravelesList, SelectBudgetOptions, AI_PROMPT } from "../constants/options";
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import AIModel from "../service/AIModal"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useGoogleLogin } from "@react-oauth/google";
import axios from 'axios'
import { FcGoogle } from "react-icons/fc";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../service/firebaseConfig";

import { AiOutlineLoading } from "react-icons/ai";
import { useNavigate } from "react-router";


// Free alternative to Google Places using OpenStreetMap (Nominatim)
function OSMAutocomplete({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value) {
      setResults([]);
      return;
    }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${value}&addressdetails=1&limit=5&accept-language=en`
    );
    const data = await res.json();

    // Filter results to only include English characters
    const englishResults = data.filter(place =>
      /^[\x00-\x7F]*$/.test(place.display_name)
    );

    setResults(englishResults);
  } catch (err) {
    console.error(err);
  }
  };

  const handleSelect = (place) => {
    setQuery(place.display_name);
    setResults([]);
    if (onSelect) onSelect(place);
  };




  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Enter destination"
        className="border p-2 w-full rounded"
      />
      {results.length > 0 && (
        <ul className="absolute bg-white border w-full max-h-60 overflow-auto mt-1 rounded shadow-lg z-10">
          {results.map((place) => (
            <li
              key={place.place_id}
              onClick={() => handleSelect(place)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CreateTrip() {
  const [formData, setFormData] = useState({
    destination: null,
    noOfDays: "",
    budget: "",
    people: "",
  });

 

  const handleInputChange = (field, value) => {
   
    setFormData((prev) => (
      { ...prev, 
        [field]: value }));
  };
  
const [openDailog,setOpenDailog]=useState(false);
const [loading, setLoading]=useState(false); 
const navigate=useNavigate();


const OnGendrateTrip =async () => {

  const user=localStorage.getItem('user');

  if(!user)
  {
    setOpenDailog(true)
    return;
  }




  if (formData?.noOfDays > 5 && !formData?.location||!formData?.budget||!formData?.people)
     {
      toast("Please fill all the details.")
    return;
  }

  


  setLoading(true);
  const FINAL_PROMPT = AI_PROMPT
    .replace('{location}', formData.destination.display_name)
    .replace('{totalDays}', formData.noOfDays)
    .replace('{people}', formData.people)
    .replace('{budget}', formData.budget)
    .replace('{totalDays}', formData.noOfDays);

  console.log("Prompt sent to backend:", FINAL_PROMPT);

  try {
    const travelPlan = await AIModel(FINAL_PROMPT);

    if (!travelPlan) {
      toast("Failed to generate travel plan.");
      setLoading(false);
      return;
    }

    console.log("Travel Plan JSON:", travelPlan);
    toast("Travel plan generated successfully!");
    
    await SaveAiTrip(travelPlan);
    setLoading(false);

    // You can now set this in state to display
    // e.g. setPlan(travelPlan);
  } catch (err) {
    console.error(err);
    toast("Try again.");
    setLoading(false);
  }
  

};


const SaveAiTrip = async (TripData) => {
  setLoading(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const docId = Date.now().toString();

  const cleanJSON = (text) => {
    return text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
  };

  const cleanedData = cleanJSON(TripData);

  await setDoc(doc(db, "AITrips", docId), {
    userSelection: formData,
    triData: JSON.parse(cleanedData),
    userEmail: user?.email,
    id: docId
  });

  setFormData({
    destination: null,
    noOfDays: "",
    budget: "",
    people: "",
  });
  navigate('/view-trip/'+docId)
};




  const login=useGoogleLogin({

    onSuccess:(codeResp)=>GetUserProfile(codeResp),
    onError:(error)=>console.log(error)
    
    
  })


const GetUserProfile=(tokenInfo)=>{
  axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenInfo?.access_token}`,{
    headers:{
      Authorization:`Bearer ${tokenInfo?.access_token}`,
      Accept:`Application/json`
    }
    }).then((resp)=>{
      console.log(resp);
      localStorage.setItem('user',JSON.stringify(resp.data));
      setOpenDailog(false);
      OnGendrateTrip();
    })
}



  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>Tell us your travel preferences 🌍 ✈️</h2>
      <p className='mt-3 text-gray-500 text-xl'>
        Just provide some basic information, and our wellness recommender will generate a customized itinerary.
      </p>

      {/* Destination */}
      <div className="mt-20">
        <h2 className='text-xl my-3 font-medium'>What is your destination of choice?</h2>
        <OSMAutocomplete
          onSelect={(place) => handleInputChange("destination", place)}
        />
        {formData.destination && (
          <p className="mt-3 text-green-600">Selected: {formData.destination.display_name}</p>
        )}
      </div>

      {/* Days */}
      <div className='mt-8'>
        <h2 className='text-xl my-3 font-medium'>How many days?</h2>
        <input
          type="number"
          placeholder="Ex. 3"
          value={formData.noOfDays}
          min={1}
          onChange={(e) => handleInputChange("noOfDays", e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>

      {/* Budget */}
      <div className='mt-8'>
        <h2 className='text-xl my-3 font-medium'>What is your budget?</h2>
        <div className='grid grid-cols-3 gap-5 mt-5'>
          {SelectBudgetOptions.map((item) => (
            <div
              key={item.id}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-4 border rounded-lg cursor-pointer hover:shadow-lg ${
                formData.budget === item.title ? "shadow-lg border-black" : ""
              }`}
            >
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      {/* Travelers */}
      <div className='mt-8'>
        <h2 className='text-xl my-3 font-medium'>Who are you traveling with?</h2>
        <div className='grid grid-cols-3 gap-5 mt-5'>
          {SelectTravelesList.map((item) => (
            <div
              key={item.id}
              onClick={() => handleInputChange("people", item.title)}
              className={`p-4 border rounded-lg cursor-pointer hover:shadow-lg ${
                formData.people === item.title ? "shadow-lg border-black" : ""
              }`}
            >
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className='my-10 flex justify-end'>
        <Button 
        disabled={loading}
        onClick={OnGendrateTrip}>
          {loading?
          <AiOutlineLoading className=" animate-spin h-7 w-7 " />: 'Generate Trip'
          }

         
        </Button>
      </div>

      <Dialog open={openDailog}>
        
        <DialogContent>
          <DialogHeader>
            
            <DialogDescription>
              <img src="/logo.svg"/>
              <h2 className="font-bold text-lg mt-7" >Sign In With Google</h2>
              <p>Sign in to the App with Google authenication securely</p>
              <Button 
             
              onClick={login}
              className="w-full h-11 mt-5 flex gap-3 items-center">
               
                <FcGoogle className="h-7 w-7" />
                Sign In With Google
                
              </Button>
              

              
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>


    </div>
  );
}

export default CreateTrip;
