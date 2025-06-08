import { useState, useRef } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  LinearProgress,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

import FORM_FIELDS from "@/constants/prakrithiFormFields";
import PrakrithiForm from "@/components/Forms/User/PrakrithiForm/PrakrithiForm";
import { ApiResponse } from "./PrakrithiAnalysis.types";
import usePrakrithi from "@/hooks/usePrakrithi/usePrakrithi";
import { UserOrExpertDetailsType } from "@/types";
import useChat from "@/hooks/useChat/useChat";
import { toast } from "react-toastify";
import SimilarPkUserDialog from "@/components/PrakrithiAnalysis/SimilarPkUserDialog/SimilarPkUserDialog";
import PrakritiAnalysisLoading from "../../../components/PrakrithiAnalysis/PrakritiAnalysisLoading/PrakritiAnalysisLoading";
import PrakrithiResultView from "@/components/PrakrithiAnalysis/PrakrithiResultView/PrakrithiResultView";

// Particles background component
const ParticlesBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-teal-400/20 dark:bg-teal-600/20"
          initial={{
            x: Math.random() * 100,
            y: Math.random() * 100,
            width: Math.random() * 10 + 5,
            height: Math.random() * 10 + 5,
            opacity: Math.random() * 0.5 + 0.1,
          }}
          animate={{
            y: [null, (Math.random() - 0.5) * 50 + 100],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Calculate total sections from form fields
const TOTAL_SECTIONS = Math.max(...FORM_FIELDS.map((field) => field.section));

export default function PrakrithiAnalysis() {
  const { emailPkPdf, getSimilarPrakrithiUsers } = usePrakrithi();
  const { createChat } = useChat();

  const [currentSection, setCurrentSection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState<boolean>(false);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);

  const [similarUsersDialogOpen, setSimilarUsersDialogOpen] = useState(false);
  const [similarPkUsers, setSimilarPkUsers] = useState<
    {
      user: UserOrExpertDetailsType;
      similarityPercentage: number;
    }[]
  >([]);
  const [findSimilarPkUsersLoad, setFindSimilarPkUsersLoad] =
    useState<boolean>(false);

  const [downloadComplete, setDownloadComplete] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [headerRef, headerInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [responseData, setResponseData] = useState<ApiResponse | null>();
  const [pdf, setPdf] = useState<Blob | null>(null);

  const [createChatLoad, setCreateChatLoad] = useState<boolean>(false);

  const createNewChat = async (userId: string) => {
    try {
      setCreateChatLoad(true);
      const response = await createChat([{ userType: "User", user: userId }]);
      if (response.success) {
        toast.success("Chat created successfully");
      }
    } catch (error: any) {
      if (error.status === 401) {
        toast.error("Please login to create a chat");
      }
    } finally {
      setCreateChatLoad(false);
    }
  };

  const findSimilarPkUsers = async () => {
    try {
      if (similarPkUsers.length > 0) return;
      setFindSimilarPkUsersLoad(true);
      const response = await getSimilarPrakrithiUsers();

      if (response.success) {
        setSimilarPkUsers(response.similarUsers);
      } else {
        setSimilarPkUsers([]);
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      setFindSimilarPkUsersLoad(false);
      setSimilarUsersDialogOpen(true);
    }
  };

  const generatePDF = async (responseData: ApiResponse) => {
    setLoading(true);
    try {
      // Add slight delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      let y = height - 50;

      const drawText = (text: string, bold = false, size = fontSize) => {
        page.drawText(text, {
          x: 50,
          y,
          size,
          font: bold ? font : regularFont,
          color: rgb(0, 0, 0),
        });
        y -= size + 5;
      };

      // Header with decorative line
      page.drawText("Ayurvedic Prakriti Analysis", {
        x: width / 2 - 100,
        y: height - 30,
        size: 18,
        font,
        color: rgb(0.2, 0.5, 0.4),
      });
      page.drawLine({
        start: { x: 50, y: height - 60 },
        end: { x: width - 50, y: height - 60 },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
      });
      y -= 60;

      // Section headers
      const drawSection = (title: string) => {
        drawText(title, true, 14);
        page.drawLine({
          start: { x: 50, y: y + 5 },
          end: { x: 150, y: y + 5 },
          thickness: 1,
          color: rgb(0.2, 0.5, 0.4),
        });
        y -= 10;
      };

      // Basic Info
      drawSection("Personal Information");
      drawText(`Name: ${responseData.Name}`);
      drawText(`Age: ${responseData.Age}`);
      drawText(`Gender: ${responseData.Gender}`);
      drawText(`Dominant Prakrithi: ${responseData.Dominant_Prakrithi}`, true);

      y -= 15;

      // Body Constituents
      drawSection("Body Constituents");
      Object.entries(responseData.Body_Constituents).forEach(([key, value]) => {
        drawText(`• ${key.replace(/_/g, " ")}: ${value}`);
      });

      y -= 15;

      // Potential Health Concerns
      drawSection("Potential Health Considerations");
      if (responseData.Potential_Health_Concerns.length === 0) {
        drawText(`{Subscribe to premium}`);
      } else {
        responseData.Potential_Health_Concerns.forEach((concern: string) => {
          drawText(`• ${concern}`);
        });
      }

      y -= 15;

      // Recommendations
      drawSection("Personalized Recommendations");

      // Dietary Guidelines
      drawText("Dietary Guidelines:", true);
      if (responseData.Recommendations.Dietary_Guidelines.length === 0) {
        drawText(`{Subscribe to premium}`);
      } else {
        responseData.Recommendations.Dietary_Guidelines.forEach(
          (item: string) => {
            drawText(`  - ${item}`);
          }
        );
      }

      // Lifestyle Suggestions
      drawText("Lifestyle Suggestions:", true);
      if (responseData.Recommendations.Lifestyle_Suggestions.length === 0) {
        drawText(`{Subscribe to premium}`);
      } else {
        responseData.Recommendations.Lifestyle_Suggestions.forEach(
          (item: string) => {
            drawText(`  - ${item}`);
          }
        );
      }

      // Ayurvedic Herbs & Remedies
      drawText("Ayurvedic Herbs & Remedies:", true);
      if (
        Array.isArray(responseData.Recommendations.Ayurvedic_Herbs_Remedies) &&
        responseData.Recommendations.Ayurvedic_Herbs_Remedies.length === 0
      ) {
        drawText(`{Subscribe to premium}`);
      } else if (
        Array.isArray(responseData.Recommendations.Ayurvedic_Herbs_Remedies)
      ) {
        responseData.Recommendations.Ayurvedic_Herbs_Remedies.forEach(
          (item: string) => {
            drawText(`  - ${item}`);
          }
        );
      } else {
        Object.entries(
          responseData.Recommendations.Ayurvedic_Herbs_Remedies
        ).forEach(([key, values]) => {
          drawText(
            `  - ${key.replace(/_/g, " ")}: ${(values as string[]).join(", ")}`
          );
        });
      }

      // Footer
      y -= 30;
      page.drawText("Thank you for your trust in Ayurveda", {
        x: width / 2 - 120,
        y,
        size: 12,
        font: regularFont,
        color: rgb(0.5, 0.5, 0.5),
      });

      // Save and trigger download
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      setPdf(blob);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
      setCurrentSection(1);
    }
  };

  const download = () => {
    if (!pdf) return;
    const url = URL.createObjectURL(pdf);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${responseData?.Name}_Prakriti_Analysis.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadComplete(true);
    setTimeout(() => setDownloadComplete(false), 3000);
  };

  const sendEmail = async () => {
    if (!responseData) return;

    setEmailLoading(true);
    try {
      // Simulate API call
      await emailPkPdf(pdf);
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setEmailLoading(false);
    }
  };

  // Loading state
  if (loading && !analysisComplete) {
    return (
      <PrakritiAnalysisLoading ParticlesBackground={ParticlesBackground} />
    );
  }

  if (analysisComplete) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-br from-teal-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden p-4"
      >
        <ParticlesBackground />
        <PrakrithiResultView
          responseData={responseData as { Dominant_Prakrithi: string }}
          download={download}
          sendEmail={sendEmail}
          emailLoading={emailLoading}
          findSimilarPkUsers={findSimilarPkUsers}
          findSimilarPkUsersLoad={findSimilarPkUsersLoad}
        />
        <SimilarPkUserDialog
          open={similarUsersDialogOpen}
          onClose={() => setSimilarUsersDialogOpen(false)}
          similarPkUsers={similarPkUsers}
          createNewChat={createNewChat}
          createChatLoad={createChatLoad}
        />
        {/* Download Complete Notification */}
        {/* <AnimatePresence>
          {downloadComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50"
            >
              <CloudDownload className="text-white" />
              <span>Report downloaded successfully!</span>
            </motion.div>
          )}
        </AnimatePresence> */}
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8 relative overflow-hidden"
      >
        <ParticlesBackground />

        <div className="w-full max-w-5xl space-y-6 relative z-10">
          <motion.div
            ref={headerRef}
            initial={{ y: -50, opacity: 0 }}
            animate={headerInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center"
          >
            <Typography
              variant="h2"
              className="mb-4 font-bold text-teal-800 dark:text-teal-300 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-indigo-600"
            >
              Discover Your Ayurvedic Constitution
            </Typography>
            <Typography
              variant="subtitle1"
              className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Complete this assessment to understand your unique Prakriti and
              receive personalized health recommendations.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card
              ref={cardRef}
              className="w-full shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl"
              component={motion.div}
              whileHover={{ y: -5 }}
            >
              <CardHeader
                title={
                  <div className="flex items-center justify-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="text-teal-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
                        <path d="M12 2v8"></path>
                        <path d="M20 12h-8"></path>
                      </svg>
                    </motion.div>
                    <span>Prakriti Analysis</span>
                  </div>
                }
                titleTypographyProps={{
                  variant: "h4",
                  className:
                    "text-center font-bold text-teal-700 dark:text-teal-300",
                }}
                className="p-6 border-b border-teal-100/50 dark:border-gray-700/50 bg-gradient-to-r from-teal-50/50 to-indigo-50/50 dark:from-gray-700/50 dark:to-gray-700/50"
              />

              <div className="px-6 pb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8 }}
                >
                  <LinearProgress
                    variant="determinate"
                    value={(currentSection / TOTAL_SECTIONS) * 100}
                    className="h-3 rounded-full bg-teal-100/50 dark:bg-gray-600/50"
                    sx={{
                      "& .MuiLinearProgress-bar": {
                        borderRadius: "999px",
                        background: "linear-gradient(90deg, #0d9488, #4f46e5)",
                      },
                    }}
                  />
                </motion.div>
                <div className="flex justify-between mt-3">
                  <Typography
                    variant="body2"
                    className="text-teal-700 dark:text-teal-300 font-medium"
                  >
                    Progress:{" "}
                    {Math.round((currentSection / TOTAL_SECTIONS) * 100)}%
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-600 dark:text-gray-300"
                  >
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
                  setAnalysisComplete={setAnalysisComplete}
                  setResponseData={setResponseData}
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <Typography
              variant="body2"
              className="text-gray-500 dark:text-gray-400"
            >
              Your responses will help us provide accurate Ayurvedic insights.
            </Typography>
            <Typography
              variant="body2"
              className="text-gray-500 dark:text-gray-400"
            >
              All information is kept confidential.
            </Typography>
          </motion.div>
        </div>

        {/* Download complete notification */}
        <AnimatePresence>
          {downloadComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50"
            >
              <span>Report downloaded successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
