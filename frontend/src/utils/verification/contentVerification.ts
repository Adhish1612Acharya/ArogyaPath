import useApi from "@/hooks/useApi/useApi";


 const verifyTextContent = async (text: string): Promise<boolean> => {
  const { post,data } = useApi<{text:"ayurveda"| "non-Ayurveda"}>();
  try {
     await post(import.meta.env.VITE_CONTENT_VERIFICATION_API, { text });
    return  data?.text === 'ayurveda' ? true : false;
  } catch (error) {
    console.error('Content verification failed:', error);
    throw new Error('Content verification service unavailable');
  }
};

export default verifyTextContent;