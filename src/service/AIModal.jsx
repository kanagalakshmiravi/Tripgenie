// AIModal.jsx


/* ================================
   AI MODAL FUNCTION
================================ */
const AIModal = async (prompt) => {
  try {
    if (!prompt || prompt.trim() === "") {
      console.error("Prompt is empty");
      return null;
    }

    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      console.error("VITE_API_URL is not set in your frontend .env file");
      return null;
    }

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Server responded with error:", res.status, errText);
      return null;
    }

    const data = await res.json();
    console.log("Full response from backend:", data);

    // Safely get AI message content
    let content = "";
    if (data?.choices?.[0]?.message?.content) {
      content = data.choices[0].message.content;
    } else {
      content = JSON.stringify(data, null, 2);
    }

    console.log("Raw AI content:", content);

    // ✅ PARSE + NORMALIZE HERE
    try {
      const parsedData = JSON.parse(content);
      const normalizedData = normalizeTripData(parsedData);

      console.log("Normalized Trip Data:", normalizedData);

      return normalizedData;
    } catch {
      // If AI didn't return valid JSON
      return content;
    }
  } catch (err) {
    console.error("Error fetching travel plan:", err);
    return null;
  }
};

export default AIModal;
