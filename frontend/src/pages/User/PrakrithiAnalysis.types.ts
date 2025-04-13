export interface ApiResponse {
  Name: string;
  Age: number;
  Gender: string;
  Dominant_Prakrithi: string;
  Body_Constituents: Record<string, string>;
  Potential_Health_Concerns: string[];
  Recommendations: {
    Dietary_Guidelines: string[];
    Lifestyle_Suggestions: string[];
    Ayurvedic_Herbs_Remedies: Record<string, string[]>;
  };
}
