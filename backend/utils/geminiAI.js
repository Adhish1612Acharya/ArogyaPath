// const axios = require("axios");

// const API_KEY = process.env.GEMINI_API_KEY;

// const generateCategories = async (description) => {
//   try {
//     const response = await axios.post(
//       "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
//       {
//         contents: [
//           {
//             parts: [
//               {
//                 text: `Generate relevant categories for this description: ${description}`,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         headers: { "Content-Type": "application/json" },
//         params: { key: API_KEY },
//       }
//     );

//     // 🔹 Extract categories from response
//     const categories =
//       response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
//     return JSON.parse(categories); // Convert text to array
//   } catch (err) {
//     console.error("Gemini AI Error:", err);
//     return [];
//   }
// };

// export default generateCategories;

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateCategories = async (req, res) => {
  try {
    const { content, media, existingFilters } = req.body;

    if (!content || !existingFilters) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const prompt = `
    You are an AI assistant specializing in content classification.  
    Your task is to categorize a given post into one or more **predefined filters**.
    
    ### **Input Data**
    - Post Description: "${content}"
    - Media (image, document, or video): "${media}" 
    - Available Filters: ${JSON.stringify(existingFilters)}
    
    ### **Task Requirements**
    1. **Select Only from Existing Filters**:  
       - The response **must include at least one filter** from the predefined filters.
       - **Do not create or suggest new filters.**
       - Match the post content **only** to the most relevant existing sub-filters.
    
    2. **Strictly Return Valid JSON**:  
       - The response must be a **pure JSON object** with no markdown, explanations, or extra formatting.  
       - The JSON output **must be parsable** without backticks or surrounding text.
    
    ### **Expected JSON Response Format**
    {
      "filters": ["At least one relevant existing sub-filter"]
    }
    
    - The **"filters" array must never be empty**.
    - **Only return predefined sub-filters**—do not generate new ones.
    - Ensure accuracy—**false positives are worse than false negatives**.
    `;

    const result = await model.generateContent([prompt]);

    const response = await result.response;
    const filters = response.text();

    console.log("Classified Filters:", filters);
    return res.json({ filters: JSON.parse(filters) });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to classify content" });
  }
};

export default generateCategories;