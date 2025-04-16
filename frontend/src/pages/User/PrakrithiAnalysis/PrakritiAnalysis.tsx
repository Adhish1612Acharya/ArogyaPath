import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { useState } from "react";

import FORM_FIELDS from "@/constants/prakrithiFormFields";
import PrakrithiForm from "@/components/Forms/User/PrakrithiForm/PrakrithiForm";
import { ApiResponse } from "./PrakrithiAnalysis.types";

// Calculate total sections from form fields
const TOTAL_SECTIONS = Math.max(...FORM_FIELDS.map((field) => field.section));

export default function PrakritiForm() {
  const [currentSection, setCurrentSection] = useState(1);
  const [loading, setLoading] = useState(false);

  const generatePDF = async (responseData: ApiResponse) => {
    setLoading(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      let y = height - 50; // Start position for text

      const drawText = (text: string) => {
        page.drawText(text, {
          x: 50,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        y -= 20; // Move to next line
      };

      // Header
      page.drawText("Health Report", {
        x: width / 2 - 50,
        y: height - 30,
        size: 16,
        font,
        color: rgb(0, 0, 1),
      });

      y -= 40;

      // Basic Info
      drawText(`Name: ${responseData.Name}`);
      drawText(`Age: ${responseData.Age}`);
      drawText(`Gender: ${responseData.Gender}`);
      drawText(`Dominant Prakrithi: ${responseData.Dominant_Prakrithi}`);

      y -= 10;

      // Body Constituents
      drawText("Body Constituents:");
      Object.entries(responseData.Body_Constituents).forEach(([key, value]) => {
        drawText(`  - ${key.replace(/_/g, " ")}: ${value}`);
      });

      y -= 10;

      // Potential Health Concerns
      drawText("Potential Health Concerns:");
      responseData.Potential_Health_Concerns.forEach((concern: string) => {
        drawText(`  - ${concern}`);
      });

      y -= 10;

      // Recommendations
      drawText("Recommendations:");

      // Dietary Guidelines
      drawText("  - Dietary Guidelines:");
      responseData.Recommendations.Dietary_Guidelines.forEach((item: string) => {
        drawText(`    • ${item}`);
      });

      // Lifestyle Suggestions
      drawText("  - Lifestyle Suggestions:");
      responseData.Recommendations.Lifestyle_Suggestions.forEach((item: string) => {
        drawText(`    • ${item}`);
      });

      // Ayurvedic Herbs & Remedies
      drawText("  - Ayurvedic Herbs & Remedies:");
      if (Array.isArray(responseData.Recommendations.Ayurvedic_Herbs_Remedies)) {
        responseData.Recommendations.Ayurvedic_Herbs_Remedies.forEach((item: string) => {
          drawText(`    • ${item}`);
        });
      } else {
        Object.entries(responseData.Recommendations.Ayurvedic_Herbs_Remedies).forEach(([key, values]) => {
          drawText(`    • ${key.replace(/_/g, " ")}: ${(values as string[]).join(", ")}`);
        });
      }

      // Save and trigger download
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${responseData.Name}_Prakriti_Analysis.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
      setCurrentSection(1); // Reset to first section after PDF generation
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 text-green-600 dark:text-green-400">
        <Loader className="animate-spin h-12 w-12" />
        <p className="mt-4 text-xl font-medium">Analyzing your Prakriti...</p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          This may take a moment
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="w-full max-w-5xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-300 mb-2">
            Discover Your Ayurvedic Constitution
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Complete this assessment to understand your unique Prakriti and receive personalized health recommendations.
          </p>
        </div>

        <Card className="w-full shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden">
          <CardHeader className="text-center p-6 border-b border-green-100 dark:border-gray-700 bg-green-50 dark:bg-gray-700">
            <CardTitle className="text-2xl md:text-3xl font-bold text-green-700 dark:text-green-300">
              Prakriti Analysis
            </CardTitle>
            <div className="mt-6 px-4">
              <Progress
                value={(currentSection / TOTAL_SECTIONS) * 100}
                className="h-3 bg-green-100 dark:bg-gray-600"
              />
              <div className="flex justify-between mt-3 text-sm">
                <span className="text-green-700 dark:text-green-300 font-medium">
                  Progress: {Math.round((currentSection / TOTAL_SECTIONS) * 100)}%
                </span>
                <span className="text-gray-600 dark:text-gray-300">
                  Section {currentSection} of {TOTAL_SECTIONS}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 md:p-8">
            <PrakrithiForm
              generatePDF={generatePDF}
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
              TOTAL_SECTIONS={TOTAL_SECTIONS}
              setLoading={setLoading}
            />
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Your responses will help us provide accurate Ayurvedic insights.</p>
          <p className="mt-1">All information is kept confidential.</p>
        </div>
      </div>
    </div>
  );
}