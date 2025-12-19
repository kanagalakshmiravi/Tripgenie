// src/service/getTravelPlan.js
// export default async function getTravelPlan(prompt) {
//   try {
//     const res = await fetch("http://localhost:5000/api/travel-plan", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ prompt }),
//     });

//     if (!res.ok) throw new Error(`Server error: ${res.status}`);

//     const data = await res.json();
//     return data.plan; // This should be the JSON you want
//   } catch (err) {
//     console.error("Error fetching travel plan:", err);
//     return null;
//   }
// }
