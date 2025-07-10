import React from "react";
import { ShieldCheck } from "lucide-react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-green-950 dark:to-gray-900 text-gray-800 dark:text-gray-100 px-4 py-10 flex justify-center"
      style={{ overflowX: "hidden" }}
    >
      <div className="max-w-4xl w-full">
        {/* Back Button (not fixed, natural flow) */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          variant="contained"
          color="primary"
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 3,
            px: isMobile ? 2 : 3,
            py: isMobile ? 0.5 : 1,
            fontSize: isMobile ? "0.75rem" : "1rem",
            boxShadow: "0 6px 18px rgba(25, 118, 210, 0.5)",
            transition: "transform 0.3s ease",
            mb: 4,
            "&:hover": {
              bgcolor: "primary.dark",
              transform: "scale(1.05)",
            },
          }}
        >
          Back
        </Button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-green-600 dark:bg-green-500 p-3 rounded-full text-white shadow-lg mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-bold text-green-700 dark:text-green-400">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Last updated: July 2025
          </p>
        </div>

        {/* Card Content */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 md:p-10 space-y-8 text-left">
          <section>
            <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-2">
              Introduction
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              At <strong>Arogyapath</strong>, your privacy matters. This policy
              describes how we collect, use, and protect your data when you use
              our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-2">
              1. What We Collect
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Name, email, and contact details</li>
              <li>Health-related data you choose to provide</li>
              <li>Device, browser, and usage information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-2">
              2. How We Use It
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>To personalize your experience and suggestions</li>
              <li>To improve service performance and reliability</li>
              <li>To send important updates and health info</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-2">
              3. Data Protection
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We use secure practices to protect your data, but no method of
              transmission is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-2">
              4. Sharing Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We do not sell your personal data. Limited data may be shared with
              trusted partners or legal authorities when required.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-2">
              5. Your Rights
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              You can access, correct, or delete your data by contacting{" "}
              <a
                href="mailto:teamparakram16@gmail.com"
                className="text-green-600 underline hover:text-green-800"
              >
                teamparakram16@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-2">
              6. Policy Updates
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may occasionally update this policy. Continued use implies
              acceptance of any changes.
            </p>
          </section>
        </div>

        {/* Footer */}
        <p className="mt-10 text-sm text-center text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Arogyapath. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
