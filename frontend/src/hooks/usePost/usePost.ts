import { useState } from "react";

import { PostFormSchema, PostSubmissionData } from "./usePost.types";
import verifyTextContent from "@/utils/verification/contentVerification";
import { toast } from "react-toastify";
import { verifyImageContent } from "@/utils/verification/imageVerification";
import { verifyVideoContent } from "@/utils/verification/videoVerification";
import { verifyPdfContent } from "@/utils/pdfUtils";
import useApi from "../useApi/useApi";

const usePost = () => {
  const { post, loading, error } = useApi();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPost = async (formData: PostFormSchema) => {
    setIsSubmitting(true);
    
    try {
      console.log("✅ Validated Post Data:", formData);
      
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
        const isVideoApproved = await verifyVideoContent(formData.media.video);
        if (!isVideoApproved) {
          toast.error('Video content does not meet platform guidelines');
          return;
        }
      }

      // Verify document if present
      if (formData.media.document) {
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
      requestFormData.append('filters', JSON.stringify(postData.filters));

      // Append media files if they exist
      postData.media.images?.forEach((image) => {
        requestFormData.append('images', image);
      });

      if (postData.media.video) {
        requestFormData.append('video', postData.media.video);
      }

      if (postData.media.document) {
        requestFormData.append('document', postData.media.document);
      }

      // Submit the post
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/posts`,
        requestFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log("Post Response:", response.data);
      toast.success('Post submitted successfully!');
      return response.data;
      
    } catch (error) {
      console.error("Post submission failed:", error);
      toast.error(error.message || 'Failed to submit post. Please try again.');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitPost,
    isSubmitting: isSubmitting || loading,
    error
  };
}

export default usePost;
