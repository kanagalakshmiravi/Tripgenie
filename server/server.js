import express from "express";
import dotenv from "dotenv";
import { Groq } from "groq-sdk";
import cors from "cors";

// Load env
dotenv.config({ path: ".env.development" });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Check API key
if (!process.env.GROQ_API_KEY) {
  console.error("ERROR: GROQ_API_KEY is missing in .env file");
  process.exit(1);
}

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Health check
app.get("/", (req, res) => res.send("Server is running!"));

// Travel plan route
app.post("/api/travel", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log("Received prompt:", prompt);

    // Fixed: removed `responseMimeType`
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-120b",
      stream: false
    });

    console.log("Groq response:", chatCompletion);

    res.json(chatCompletion);

  } catch (err) {
    console.error("Error generating travel plan:", err);
    res.status(500).json({
      error: "Failed to generate travel plan",
      details: err.message || err.toString()
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
