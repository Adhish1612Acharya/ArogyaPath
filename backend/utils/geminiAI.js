const axios = require("axios");

const API_KEY = "AIzaSyB1aDRqfkKCY9Tu8qDTlGRUfTLZaTefRjI"; // 🔹 Replace with your actual Gemini API key

async function generateCategories(description) {
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
      {
        contents: [{ parts: [{ text: `Generate relevant categories for this description: ${description}` }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
        params: { key: API_KEY },
      }
    );

    // 🔹 Extract categories from response
    const categories = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    return JSON.parse(categories); // Convert text to array
  } catch (err) {
    console.error("Gemini AI Error:", err);
    return [];
  }
}

module.exports = { generateCategories };
