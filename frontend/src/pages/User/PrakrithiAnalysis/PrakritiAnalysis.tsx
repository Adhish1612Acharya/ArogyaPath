import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { CircularProgress, Card, CardHeader, CardContent, Typography, LinearProgress, Button } from "@mui/material";
import { CloudDownload } from "@mui/icons-material";

import FORM_FIELDS from "@/constants/prakrithiFormFields";
import PrakrithiForm from "@/components/Forms/User/PrakrithiForm/PrakrithiForm";
import { ApiResponse } from "./PrakrithiAnalysis.types";
import useApi from "@/hooks/useApi/useApi";

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
      responseData.Recommendations.Dietary_Guidelines.forEach(
        (item: string) => {
          drawText(`    • ${item}`);
        }
      );

      // Lifestyle Suggestions
      drawText("  - Lifestyle Suggestions:");
      responseData.Recommendations.Lifestyle_Suggestions.forEach(
        (item: string) => {
          drawText(`    • ${item}`);
        }
      );

      // Ayurvedic Herbs & Remedies
      drawText("  - Ayurvedic Herbs & Remedies:");
      if (
        Array.isArray(responseData.Recommendations.Ayurvedic_Herbs_Remedies)
      ) {
        responseData.Recommendations.Ayurvedic_Herbs_Remedies.forEach(
          (item: string) => {
            drawText(`    • ${item}`);
          }
        );
      } else {
        Object.entries(
          responseData.Recommendations.Ayurvedic_Herbs_Remedies
        ).forEach(([key, values]) => {
          drawText(
            `    • ${key.replace(/_/g, " ")}: ${(values as string[]).join(
              ", "
            )}`
          );
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
      <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-br from-teal-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <CircularProgress color="primary" size={60} />
        <Typography variant="h6" className="mt-6 text-teal-600 dark:text-teal-400">
          Analyzing your Prakriti...
        </Typography>
        <Typography variant="body2" className="mt-2 text-gray-500 dark:text-gray-400">
          This may take a moment
        </Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="w-full max-w-5xl space-y-6">
        <div className="text-center">
          <Typography variant="h3" className="mb-2 font-bold text-teal-800 dark:text-teal-300">
            Discover Your Ayurvedic Constitution
          </Typography>
          <Typography variant="subtitle1" className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Complete this assessment to understand your unique Prakriti and
            receive personalized health recommendations.
          </Typography>
        </div>

        <Card className="w-full shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden">
          <CardHeader
            title="Prakriti Analysis"
            titleTypographyProps={{
              variant: "h4",
              className: "text-center font-bold text-teal-700 dark:text-teal-300"
            }}
            className="p-6 border-b border-teal-100 dark:border-gray-700 bg-teal-50 dark:bg-gray-700"
          />
          
          <div className="px-6 pb-4">
            <LinearProgress 
              variant="determinate" 
              value={(currentSection / TOTAL_SECTIONS) * 100} 
              className="h-2 bg-teal-100 dark:bg-gray-600"
              color="primary"
            />
            <div className="flex justify-between mt-3">
              <Typography variant="body2" className="text-teal-700 dark:text-teal-300 font-medium">
                Progress: {Math.round((currentSection / TOTAL_SECTIONS) * 100)}%
              </Typography>
              <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
                Section {currentSection} of {TOTAL_SECTIONS}
              </Typography>
            </div>
          </div>

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

        <div className="text-center">
          <Typography variant="body2" className="text-gray-500 dark:text-gray-400">
            Your responses will help us provide accurate Ayurvedic insights.
          </Typography>
          <Typography variant="body2" className="text-gray-500 dark:text-gray-400">
            All information is kept confidential.
          </Typography>
        </div>
      </div>
    </div>
  );
}