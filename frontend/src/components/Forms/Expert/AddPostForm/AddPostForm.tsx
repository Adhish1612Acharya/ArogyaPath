import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Import UI components from ShadCN
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
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import postCreationSchema from "./AddPostFormSchema";
import { X } from "lucide-react";

// Get inferred TypeScript type from schema
type PostFormSchema = z.infer<typeof postCreationSchema>;

const PostForm = () => {
  const form = useForm<PostFormSchema>({
    resolver: zodResolver(postCreationSchema),
    defaultValues: {
      title: "",
      description: "",
      media: {
        images: [],
        video: undefined,
        document: undefined,
      },
    },
  });

  const [mediaPreview, setMediaPreview] = useState<PostFormSchema["media"]>({
    images: [],
    video: undefined,
    document: undefined,
  });

  // Refs for hidden inputs
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const docInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 3) {
      alert("You can only upload up to 3 images.");
      return;
    }
    form.setValue("media.images", files);
    setMediaPreview((prev) => ({ ...prev, images: files }));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("media.video", file);
      setMediaPreview((prev) => ({ ...prev, video: file }));
    }
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("media.document", file);
      setMediaPreview((prev) => ({ ...prev, document: file }));
    }
  };

  const handleImagePreviewCancel = (i: number) => {
    const newImages =
      mediaPreview.images?.filter((_, index) => index !== i) || [];
    setMediaPreview((prev) => ({
      ...prev,
      images: newImages,
    }));
    form.setValue("media.images", newImages);
  };

  const handleVideoPreviewCancel = () => {
    setMediaPreview((prev) => ({
      ...prev,
      video: undefined,
    }));
    form.setValue("media.video", undefined);
  };

  const handleDocPreviewCancel = () => {
    setMediaPreview((prev) => ({
      ...prev,
      document: undefined,
    }));
    form.setValue("media.document", undefined);
  };

  const onSubmit = (data: PostFormSchema) => {
    console.log("✅ Validated Post Data:", data);
    // Upload / Save logic here
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter post title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your post..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hidden File Inputs */}
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
          accept=".pdf,.doc,.docx"
          ref={docInputRef}
          onChange={handleDocChange}
          className="hidden"
        />

        {/* Media Upload Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            variant="outline"
          >
            Add Images (max 3)
          </Button>
          <Button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            variant="outline"
          >
            Add Video
          </Button>
          <Button
            type="button"
            onClick={() => docInputRef.current?.click()}
            variant="outline"
          >
            Add Document
          </Button>
        </div>

        {/* Previews */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
          {mediaPreview.images?.map((img, i) => (
            <div key={i} className="relative group">
              <img
                src={URL.createObjectURL(img)}
                alt={`Preview ${i}`}
                className="h-32 w-full object-cover rounded-md border"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition"
                onClick={() => {
                  handleImagePreviewCancel(i);
                }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {mediaPreview.video && (
            <div className="relative mt-2">
              <video
                controls
                className="w-full max-h-64 rounded-md border"
                src={URL.createObjectURL(mediaPreview.video)}
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded"
                onClick={() => {
                  handleVideoPreviewCancel();
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}
          {mediaPreview.document && (
            <div className="relative mt-2 bg-muted px-4 py-2 rounded-md border">
              <span>📄 {mediaPreview.document.name}</span>
              <button
                type="button"
                className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded"
                onClick={() => {
                  handleDocPreviewCancel();
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full">
          Post
        </Button>
      </form>
    </Form>
  );
};

export default PostForm;
