import { geminiFlashModel } from "../../lib/geminiModel.js";
import parseAiJsonResponse from "../parseAiResponse.js";

// const mediaPrompt = `
// You are an AI media validator specialized in verifying content related to Ayurveda, naturopathy, and natural healing practices rooted in Indian heritage. Analyze the provided image or video (in base64 format) and return a JSON response based on the validation criteria.

// ### Validation Criteria:
// ### Detailed Validation Rules:

// 1. VALID if image or video contains ANY of these:
//    - Content related to Ayurveda (herbal remedies, treatments, etc.)
//    - Naturopathy-based practices (natural healing methods, detoxification, etc.)
//    - Yoga or meditation practices promoting holistic health and well-being
//    - Healthy lifestyle practices such as quitting sugar, processed foods, or unhealthy habits
//    - Dietary content promoting natural foods, traditional Indian diets, or plant-based nutrition
//    - Natural ways of healing diseases through Indian heritage (herbs, traditional therapies, etc.)
//    - Practices or content that reject or contrast with allopathic treatments and emphasize natural healing

// 2. INVALID if image or video contains ANY of these:
//    - Content focused on allopathic or pharmaceutical treatments, especially with no natural healing context
//    - Promotional content for commercial pharmaceutical products or synthetic treatments
//    - Content related to non-natural, processed foods or unhealthy eating habits (e.g., promoting sugar, junk food, etc.)
//    - Content promoting synthetic or artificial health methods
//    - General medical practices or treatments not tied to Ayurveda or naturopathy

// 3. SPECIAL CASES:
//    - Accept content that promotes Ayurveda, naturopathy, or yoga as methods of holistic healing
//    - Accept content that discusses or illustrates healthy, natural lifestyles, including food choices, exercise, and mental health
//    - Reject content that discusses conventional medicine or practices without highlighting natural healing alternatives

// 2. Automatic rejection for:
//    - Allopathic treatments or pharmaceutical-based content without a focus on natural healing
//    - Content that promotes unhealthy lifestyle choices (sugar, junk food, etc.)
//    - Commercial or promotional content without educational value on natural healing

// ### Response Format:
// { "valid": boolean }
// `;

const mediaPrompt = `
You are an AI content validator for an Ayurvedic health platform (ArogyaPath). Strictly analyze the provided image or video for authenticity, relevance, and educational value in the context of Ayurveda. Return a structured JSON response.

## GOAL:
Ensure only authentic, context-rich, and Ayurvedic-relevant visuals are marked valid.

## SMART VALIDATION CRITERIA:

### ✅ VALID if content includes:
1. *Recognizable Ayurvedic Activities*:
   - Panchakarma treatments (Abhyanga, Shirodhara, Nasya, etc.)
   - Prakrithi analysis sessions
   - Preparation or use of Ayurvedic herbs (Turmeric, Ashwagandha, etc.)
   - Dosha-based health routines (Vata, Pitta, Kapha)

2. *Practitioner Context*:
   - Certified Ayurvedic doctors or practitioners visible with identifiable attire/tools (e.g., Ayurvedic clinic setup, consultation scenes)

3. *Educational Visuals*:
   - Informative diagrams of doshas, herbal uses, diagnostic charts
   - Demonstration videos explaining Ayurvedic principles

4. *Environment and Setup*:
   - Traditional clinics, treatment rooms, or therapy spaces clearly styled in Ayurvedic tradition
   - Use of Sanskrit or Ayurveda-related terms in visuals or overlays

5. *Keyword Cues* (if text present):
   - Must include terms like: "Ayurveda", "Dosha", "Prakrithi", "Holistic", "Herbal remedy", "Balance", "Nadi Pariksha", etc.

---

### ❌ INVALID if content includes:
1. *Unrelated Medical Practices*:
   - Allopathy, Western diagnostics (X-rays, syringes, pills, modern hospitals)
   - Non-herbal branded supplements

2. *Generic Wellness Content*:
   - Yoga, meditation, or spa scenes without explicit Ayurvedic connection
   - Gym routines, Western diet advice, modern physiotherapy

3. *Non-Educational Promotional Material*:
   - Commercial ads for products with no educational/medicinal context
   - Influencer marketing without medical or Ayurveda relevance

4. *Ambiguity or Lack of Context*:
   - Vague visuals with no identifiable Ayurveda link
   - Unclear scenes with no traditional markers, no text overlay, no practitioner, or herbal context

5. *Cultural Misappropriation*:
   - Misuse or misrepresentation of Ayurvedic traditions for aesthetics or trendiness without factual grounding

---

### ⚠ SPECIAL CASE HANDLING:
- Accept yoga/meditation ONLY if Ayurvedic concepts (e.g., dosha-specific yoga) are explicitly shown or mentioned.
- Accept modern-looking visuals IF overlays, voiceover, or captions clearly link to Ayurvedic knowledge.
- Reject stock images with aesthetic appeal but no Ayurveda-based elements or language.

---

### Response Format:
{
  "valid": boolean,
  "reason": "Short justification for the decision based on validation criteria",
  "confidence_score": float (range: 0.0 to 1.0)
}
`;
export const verifyMediaContent = async (base64, mediaType) => {
  try {
    console.log("Verifying media content...");
    console.log("Base64 length:", base64);
    console.log("Media type:", mediaType);
    const result = await geminiFlashModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64,
                mimeType: mediaType,
              },
            },
            { text: mediaPrompt },
          ],
        },
      ],
    });

    const responseText = result.response.text();
    const parsed = parseAiJsonResponse(responseText);

    console.log("Parsed verify media response:", parsed);

    const valid = parsed?.valid === "true" || parsed?.valid === true;
    if (valid) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error verifying image:", error);
    return false;
  }
};
