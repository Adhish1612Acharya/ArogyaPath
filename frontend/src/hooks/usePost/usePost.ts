import { useState } from "react";
import { PostFormSchema, PostSubmissionData } from "./usePost.types";
import { toast } from "react-toastify";
import useApi from "../useApi/useApi";
import useContentVerification from "../useContentVerification/useContentVerification";


const usePost = () => {
  const { post } = useApi<{success:boolean ;message:string;userId:string;postId:string}>();
  const {verifyImageContent,verifyPdfContent,verifyTextContent,verifyVideoContent}=useContentVerification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPost = async (formData: PostFormSchema) => {
    setIsSubmitting(true);
    
    try {
      console.log(" Validated Post Data:", formData);
      
      // Prepare the post data structure
      const postData: PostSubmissionData = {
        title: formData.title,
        description: formData.description,
        filters: ["Medicinal", "Health"],
        media: {
           images: formData.media.images ,
        video: formData.media.video ,
        document: formData.media.document ,
        }
      };

      // Verify text content
      const content = `Title: ${postData.title}\nDescription: ${postData.description}`;
      const isTextApproved = await verifyTextContent(content);
      
      if (!isTextApproved) {
        toast.error('Post content does not meet platform guidelines');
        return;
      }

      // Verify images if present
      if (formData.media.images.length > 0) {
        console.log("Image verification");
        for (const image of formData.media.images) {
          const isImageApproved = await verifyImageContent(image);
          if (!isImageApproved) {
            toast.error('One or more images do not meet platform guidelines');
            return;
          }
        }
      }

      // Verify video if present
      if (formData.media.video) {
        console.log("Video verification");
        const isVideoApproved = await verifyVideoContent(formData.media.video);
        if (!isVideoApproved) {
          toast.error('Video content does not meet platform guidelines');
          return;
        }
      }

      // Verify document if present
      if (formData.media.document) {
        console.log("Document verification");
        const isDocumentApproved = await verifyPdfContent(formData.media.document);
        if (!isDocumentApproved) {
          toast.error('Document content does not meet platform guidelines');
          return;
        }
      }

      // Prepare FormData for the request
      const requestFormData = new FormData();
      requestFormData.append('title', postData.title);
      requestFormData.append('description', postData.description);
      requestFormData.append('filters', JSON.stringify(["all", "medicine"]));


          // Handle media - only one type at a time
    if (formData.media.images.length > 0) {
      // Append all images
      formData.media.images.forEach((image) => {
        requestFormData.append('media', image);
      });
    } 
    else if (formData.media.video) {
      requestFormData.append('media', formData.media.video);
    } 
    else if (formData.media.document) {
      requestFormData.append('media', formData.media.document);
    }

    

      // Submit the post
     const response=await post(
        `${import.meta.env.VITE_SERVER_URL}/api/posts`,
        requestFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log("Post Response:",  response);
      toast.success('Post submitted successfully!');
      return  response;
      
    } catch (error:any) {
      if (error.isAxiosError) {
        // Handle known error cases
        if(error.status===401){
          toast.error('You are not authenticated. Please log in.');
        }else if(error.status===403){
          toast.error('You are not authorized to perform this action.');
        }else
        if (error.status === 413) {
          toast.error('File size too large');
        } else if (error.status === 429) {
          toast.error('Too many requests - please slow down');
        } else {
          // Fallback to error message from useApi
          toast.error(error.message); 
        }
      } else {
        // Non-Axios errors (e.g., verification failures)
        toast.error(error.message || 'Submission failed');
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitPost,
    isSubmitting: isSubmitting ,
  };
}

export default usePost;
