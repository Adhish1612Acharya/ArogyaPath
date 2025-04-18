import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import postCreationSchema from "./AddPostFormSchema";
import usePost from "@/hooks/usePost/usePost";
import { Button as MUIButton } from "@mui/material";
import { Loader, X } from "lucide-react";

type PostFormSchema = z.infer<typeof postCreationSchema>;

const PostForm = () => {
  const { submitPost } = usePost();
  const navigate = useNavigate();

  const form = useForm<PostFormSchema>({
    resolver: zodResolver(postCreationSchema),
    defaultValues: {
      title: "",
      description: "",
      media: {
        images: [],
        video: null,
        document: null,
      },
    },
  });

  const [mediaPreview, setMediaPreview] = useState<{
    images: string[];
    video: string | null;
    document: string | null;
  }>({
    images: [],
    video: null,
    document: null,
  });

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const docInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const currentImages = form.getValues("media.images") || [];
    if (currentImages.length + newFiles.length > 3) {
      alert("You can only upload up to 3 images in total.");
      return;
    }
    const updatedImages = [...currentImages, ...newFiles];
    form.setValue("media.images", updatedImages);
    form.setValue("media.document", null);
    form.setValue("media.video", null);
    setMediaPreview((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        ...newFiles.map((file) => URL.createObjectURL(file)),
      ],
      document: null,
      video: null,
    }));
    imageInputRef.current!.value = ""; // Clear the input value to allow re-uploading the same file
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("media.images", []);
      form.setValue("media.document", null);
      form.setValue("media.video", file);
      setMediaPreview({
        images: [],
        document: null,
        video: URL.createObjectURL(file),
      });
    }
    videoInputRef.current!.value = ""; // Clear the input value to allow re-uploading the same file
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("media.images", []);
      form.setValue("media.video", null);
      form.setValue("media.document", file);
      setMediaPreview({
        images: [],
        video: null,
        document: URL.createObjectURL(file),
      });
    }
    docInputRef.current!.value = ""; // Clear the input value to allow re-uploading the same file
  };

  const handleImagePreviewCancel = (i: number) => {
    URL.revokeObjectURL(mediaPreview.images[i]);
    const newImages =
      mediaPreview.images?.filter((_, index) => index !== i) || [];
    setMediaPreview((prev) => ({ ...prev, images: newImages }));
    const currentImages = form.getValues("media.images") || [];
    const newFiles = currentImages.filter((_, index) => index !== i);
    form.setValue("media.images", newFiles);
  };

  const handleVideoPreviewCancel = () => {
    URL.revokeObjectURL(mediaPreview.video || "");
    setMediaPreview((prev) => ({ ...prev, video: null }));
    form.setValue("media.video", null);
  };

  const handleDocPreviewCancel = () => {
    URL.revokeObjectURL(mediaPreview.document || "");
    setMediaPreview((prev) => ({ ...prev, document: null }));
    form.setValue("media.document", null);
  };


  const onSubmit = async (newPostData: PostFormSchema) => {
    try {
      console.log("New Post : ", newPostData);
        const response = await submitPost(newPostData);
        if (response?.success) {
          form.reset();
          navigate(`/expert/posts/${response?.postId}`);
        }
    } catch (error: any) {
      console.error("Post failed:", error.message);
      if (error.status === 401) navigate("/auth");
      else if (error.status === 403) navigate("/");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-3xl mx-auto"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter post title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your post..."
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <input
          type="file"
          accept="image/*"
          multiple
          ref={imageInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        <input
          type="file"
          accept="video/*"
          ref={videoInputRef}
          onChange={handleVideoChange}
          className="hidden"
        />
        <input
          type="file"
          accept=".pdf"
          ref={docInputRef}
          onChange={handleDocChange}
          className="hidden"
        />

        <div className="flex flex-wrap gap-4">
          <MUIButton
            variant="outlined"
            color="primary"
            onClick={() => imageInputRef.current?.click()}
          >
            Upload Images
          </MUIButton>
          <MUIButton
            variant="outlined"
            color="secondary"
            onClick={() => videoInputRef.current?.click()}
          >
            Upload Video
          </MUIButton>
          <MUIButton
            variant="outlined"
            color="success"
            onClick={() => docInputRef.current?.click()}
          >
            Upload Document
          </MUIButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {mediaPreview.images?.map((img, i) => (
            <div
              key={i}
              className="relative group shadow rounded-md overflow-hidden"
            >
              <img
                src={img}
                alt={`preview-${i}`}
                className="w-full h-40 object-cover rounded-md"
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full p-1"
                onClick={() => handleImagePreviewCancel(i)}
              >
                <X size={16} className="text-black" />
              </button>
            </div>
          ))}
          {mediaPreview.video && (
            <div className="relative shadow rounded-md overflow-hidden">
              <video
                controls
                className="w-full max-h-64 rounded-md"
                src={mediaPreview.video}
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full p-1"
                onClick={handleVideoPreviewCancel}
              >
                <X size={16} className="text-black" />
              </button>
            </div>
          )}
          {mediaPreview.document && (
            <div className="relative p-4 border rounded-md bg-muted text-sm shadow">
              <span
                className="text-blue-600 underline cursor-pointer"
                onClick={() => {
                  window.open(mediaPreview.document || "", "_blank");
                }}
              >
                📄 {form.getValues("media.document")?.name || "Document"}
              </span>
              <button
                type="button"
                className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full p-1"
                onClick={handleDocPreviewCancel}
              >
                <X size={16} className="text-black" />
              </button>
            </div>
          )}
        </div>

        <MUIButton
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={form.formState.isSubmitting}
          sx={{
            py: 1.5,
            fontWeight: "bold",
            fontSize: "1rem",
            textTransform: "none",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          {form.formState.isSubmitting ? (
            <Loader className="animate-spin" />
          ) : (
            "Post"
          )}
        </MUIButton>
      </form>
    </Form>
  );
};

export default PostForm;
