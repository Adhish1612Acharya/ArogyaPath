import useApi from "@/hooks/useApi/useApi";
import extractTextFromPdf from "@/utils/pdfUtils";


type VerificationResponse = { prediction: "Ayurveda" | "Non-Ayurveda" };

const useContentVerification = () => {
  const { post} = useApi<VerificationResponse>();

  const verifyTextContent = async (text: string): Promise<boolean> => {
    try {
   const response=await post(
        import.meta.env.VITE_CONTENT_VERIFICATION_API,
        { text }
      );
      console.log("Response : ",response);
      return response?.prediction === "Ayurveda";
    } catch (error) {
      console.error("Text content verification failed:", error);
      throw new Error("Text content verification service unavailable");
    }
  };

  const verifyImageContent = async (imageFile: File): Promise<boolean> => {
    try {
        const formData = new FormData();
        formData.append("file", imageFile);
       const  response=await post(
        import.meta.env.VITE_IMAGE_VERIFICATION_API,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.Type === "Ayurveda";
    } catch (error) {
      console.error("Image content verification failed:", error);
      throw new Error("Image content verification service unavailable");
    }
  };

  const verifyVideoContent = async (videoFile: File): Promise<boolean> => {
    try {
        const formData = new FormData();
        formData.append("file", videoFile);
 const response=await post(
        import.meta.env.VITE_VIDEO_VERIFICATION_API,
        videoFile,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.Type === "Ayurveda";
    } catch (error) {
      console.error("Video content verification failed:", error);
      throw new Error("Video content verification service unavailable");
    }
  };

  const verifyPdfContent = async (pdfFile: File): Promise<boolean> => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfText = await extractTextFromPdf(new Uint8Array(arrayBuffer));
      return await verifyTextContent(pdfText);
    } catch (error) {
      console.error("PDF content verification failed:", error);
      throw new Error("PDF content verification service unavailable");
    }
  };

  return {
    verifyTextContent,
    verifyImageContent,
    verifyVideoContent,
    verifyPdfContent,
  };
};

export default useContentVerification;
