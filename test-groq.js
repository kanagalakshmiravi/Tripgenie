import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.VITE_GROQ_API_KEY, // your API key from .env
});

async function testAPI() {
  try {
    const response = await client.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "user",
          content: "Hello! This is a test message.",
        },
      ],
    });

    console.log("API Response:\n");
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error);
  }
}

testAPI();
