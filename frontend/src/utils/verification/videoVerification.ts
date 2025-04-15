import useApi from "@/hooks/useApi/useApi";

export const verifyVideoContent = async (videoFile: File): Promise<boolean> => {
  const { post,data } = useApi<{text:"ayurveda" | "non-Ayurveda"}>();
  try {
    
     await post(import.meta.env.VITE_VIDEO_VERIFICATION_API, videoFile, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data?.text==="ayurveda" ? true : false;
  } catch (error) {
    console.error('Video verification failed:', error);
    throw new Error('Video verification service unavailable');
  }
};