import parseAiJsonResponse from "../parseAiResponse.js";

const textPrompt = `
You are an AI content validator specialized in verifying text-based content related to Ayurveda, naturopathy, and natural healing practices rooted in Indian heritage. Analyze the provided text (title, description, routines, PDF content, etc.) and return a JSON response based on the validation criteria.

### Validation Criteria:
### Detailed Validation Rules:

1. VALID if text contains ANY of these:
   - Content related to Ayurveda (herbal remedies, treatments, etc.)
   - Naturopathy-based practices (natural healing methods, detoxification, etc.)
   - Yoga or meditation practices promoting holistic health and well-being
   - Healthy lifestyle practices such as quitting sugar, processed foods, or unhealthy habits
   - Dietary content promoting natural foods, traditional Indian diets, or plant-based nutrition
   - Natural ways of healing diseases through Indian heritage (herbs, traditional therapies, etc.)
   - Practices or content that reject or contrast with allopathic treatments and emphasize natural healing
   
2. INVALID if text contains ANY of these:
   - Content focused on allopathic or pharmaceutical treatments, especially with no natural healing context
   - Promotional content for commercial pharmaceutical products or synthetic treatments
   - Content related to non-natural, processed foods or unhealthy eating habits (e.g., promoting sugar, junk food, etc.)
   - Content promoting synthetic or artificial health methods
   - General medical practices or treatments not tied to Ayurveda or naturopathy
   
3. SPECIAL CASES:
   - Accept content that promotes Ayurveda, naturopathy, or yoga as methods of holistic healing
   - Accept content that discusses or illustrates healthy, natural lifestyles, including food choices, exercise, and mental health
   - Reject content that discusses conventional medicine or practices without highlighting natural healing alternatives

2. Automatic rejection for:
   - Allopathic treatments or pharmaceutical-based content without a focus on natural healing
   - Content that promotes unhealthy lifestyle choices (sugar, junk food, etc.)
   - Commercial or promotional content without educational value on natural healing

### Response Format:
{ "valid": boolean }
`;

export const verifyTextContent = async (textContent) => {
  try {
   

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: textPrompt + "\n" + textContent }],
        },
      ],
    });

    const responseText = result.response.text();
    const parsed = parseAiJsonResponse(responseText);

    return parsed?.valid === true || parsed?.valid === "true";
  } catch (error) {
    console.error("Error verifying text content:", error);
    return false;
  }
};
