import useApi from "@/hooks/useApi/useApi";

export const verifyImageContent = async (imageFile: File): Promise<boolean> => {
  const { post,data } = useApi<{text:"ayurveda" | "non-Ayurveda"}>();
  try {
    
     await post(import.meta.env.VITE_IMAGE_VERIFICATION_API,  imageFile, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data?.text==="ayurveda" ? true : false;
  } catch (error) {
    console.error('Image verification failed:', error);
    throw new Error('Image verification service unavailable');
  }
};