import { useState } from "react";
import {
  PostFormSchema,
  PostFormWithRoutineSchema,
  PostSubmissionData,
} from "./usePost.types";
import { toast } from "react-toastify";
import useApi from "../useApi/useApi";
import useContentVerification from "../useContentVerification/useContentVerification";

const usePost = () => {
  const { post } = useApi<{
    success: boolean;
    message: string;
    userId: string;
    postId: string;
  }>();
  const {
    verifyImageContent,
    verifyPdfContent,
    verifyTextContent,
    verifyVideoContent,
  } = useContentVerification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPost = async (formData: PostFormSchema) => {
    setIsSubmitting(true);

    try {
      console.log("Validated Post Data:", formData);

      const postData: PostSubmissionData = {
        title: formData.title,
        description: formData.description,
        filters: ["Medicinal", "Health"],
        media: {
          images: formData.media.images,
          video: formData.media.video,
          document: formData.media.document,
        },
      };

      const content = `Title: ${postData.title}\nDescription: ${postData.description}`;
      const isTextApproved = await verifyTextContent(content);
      if (!isTextApproved) {
        toast.error("Post content does not meet platform guidelines");
        return;
      }

      if (formData.media.images.length > 0) {
        for (const image of formData.media.images) {
          const isImageApproved = await verifyImageContent(image);
          if (!isImageApproved) {
            toast.error("One or more images do not meet platform guidelines");
            return;
          }
        }
      }

      if (formData.media.video) {
        const isVideoApproved = await verifyVideoContent(formData.media.video);
        if (!isVideoApproved) {
          toast.error("Video content does not meet platform guidelines");
          return;
        }
      }

      if (formData.media.document) {
        const isDocumentApproved = await verifyPdfContent(
          formData.media.document
        );
        if (!isDocumentApproved) {
          toast.error("Document content does not meet platform guidelines");
          return;
        }
      }

      const requestFormData = new FormData();
      requestFormData.append("title", postData.title);
      requestFormData.append("description", postData.description);
      requestFormData.append("filters", JSON.stringify(["all", "medicine"]));

      if (formData.media.images.length > 0) {
        formData.media.images.forEach((image) => {
          requestFormData.append("media", image);
        });
      } else if (formData.media.video) {
        requestFormData.append("media", formData.media.video);
      } else if (formData.media.document) {
        requestFormData.append("media", formData.media.document);
      }

      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/posts`,
        requestFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Post submitted successfully!");
      return response;
    } catch (error: any) {
      if (error.isAxiosError) {
        if (error.status === 401) {
          toast.error("You are not authenticated. Please log in.");
        } else if (error.status === 403) {
          toast.error("You are not authorized to perform this action.");
        } else if (error.status === 413) {
          toast.error("File size too large");
        } else if (error.status === 429) {
          toast.error("Too many requests - please slow down");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error(error.message || "Submission failed");
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitRoutinePost = async (formData: PostFormWithRoutineSchema) => {
    setIsSubmitting(true);

    try {
      const postData: PostFormWithRoutineSchema = {
        title: formData.title,
        description: formData.description,
        routines: formData.routines,
        thumbnail: formData.thumbnail,
        filters: ["Medicinal", "Health"],
      };

      const content = `Title: ${postData.title}\nDescription: ${postData.description}`;
      const isTextApproved = await verifyTextContent(content);
      if (!isTextApproved) {
        toast.error("Post content does not meet platform guidelines");
        return;
      }

      if (formData.thumbnail) {
        const isImageApproved = await verifyImageContent(formData.thumbnail);
        if (!isImageApproved) {
          toast.error("One or more images do not meet platform guidelines");
          return;
        }
      }

      const requestFormData = new FormData();
      requestFormData.append("title", postData.title);
      requestFormData.append("description", postData.description);
      requestFormData.append("filters", JSON.stringify(["all", "medicine"]));
      requestFormData.append("media", postData.thumbnail || "");
      requestFormData.append("routines", JSON.stringify(postData.routines));

      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/posts`,
        requestFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Post submitted successfully!");
      return response;
    } catch (error: any) {
      if (error.isAxiosError) {
        if (error.status === 401) {
          toast.error("You are not authenticated. Please log in.");
        } else if (error.status === 403) {
          toast.error("You are not authorized to perform this action.");
        } else if (error.status === 413) {
          toast.error("File size too large");
        } else if (error.status === 429) {
          toast.error("Too many requests - please slow down");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error(error.message || "Submission failed");
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitPost,
    submitRoutinePost,
    isSubmitting,
  };
};

export default usePost;
