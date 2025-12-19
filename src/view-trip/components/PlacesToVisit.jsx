

import React from "react";
import PlaceCardItem from "./PlaceCardItem";

export default function PlacesToVisit({ trip }) {
  const itinerary = trip?.triData?.itinerary;

  // Loading state
  if (!itinerary || Object.keys(itinerary).length === 0) {
    return <p className="mt-5 text-gray-500">Loading itinerary...</p>;
  }

  return (
    <div className="mt-5">
      <h2 className="font-bold text-lg">Places to Visit</h2>

      <div>
        {Object.entries(itinerary).map(([dayKey, dayData], index) => {
          const activities = dayData.activities || [];
          
          return (
            <div key={dayKey} className="mt-3">
              <h2 className="font-medium text-lg">
                {dayKey.replace("_", " ").toLowerCase()}
              </h2>

              {activities.length === 0 ? (
                <p className="text-gray-500 mt-2">
                  No places found for this day.
                </p>
              ) : (
                <div className="grid md:grid-cols-2 gap-5">
                  {activities.map((place, idx) => (
                    
                    <div key={idx} className="my-3">
                      {place.bestVisitTime && (
                        
                        <h2 className="font-medium text-sm text-orange-600">
                          {place.bestVisitTime}
                        </h2>
                      )}
                      <PlaceCardItem place={place} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          );
        

        })}
      </div>
    </div>
  );
}






