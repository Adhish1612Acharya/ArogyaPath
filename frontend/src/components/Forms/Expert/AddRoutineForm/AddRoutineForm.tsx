import React, { use } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { X, Plus } from "lucide-react";
import { useRef, useState } from "react";
import addRoutineFormSchema from "./AddRoutineFormSchema";
import { z } from "zod";
import usePost from "@/hooks/usePost/usePost";
import { useNavigate } from "react-router-dom";

type RoutineFormSchema = z.infer<typeof addRoutineFormSchema>;

const AddRoutineForm = () => {

  const { submitRoutinePost } = usePost();

  const navigate = useNavigate();

  const form = useForm<RoutineFormSchema>({
    resolver: zodResolver(addRoutineFormSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnail: null,
      routines: [{ time: "", content: "" }],
    },
  });

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const thumbnailRef = useRef<HTMLInputElement | null>(null);

  const {
    fields: routineFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "routines",
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("thumbnail", file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const cancelThumbnail = () => {
    form.setValue("thumbnail", null);
    setThumbnailPreview(null);
  };

  const onSubmit = async (newPostData: RoutineFormSchema) => {
    try {
      const newPost = {
        ...newPostData,
        filters:["all", "ayurveda"],
      };
      const response = await submitRoutinePost(newPost);

      if (response?.success) {
        form.reset();
        navigate(`/expert/posts/${response?.postId}`);
      }
    } catch (error: any) {
      console.error("Post failed:", error.message);
      console.error("Status code:", error.status);
      console.error("Response data:", error.data);

      // Show user-friendly error based on status code
      if (error.status === 401) {
        navigate("/auth");
      } else if (error.status === 403) {
        navigate("/");
      }
    }
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
                <Input placeholder="Enter routine title" {...field} />
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
                <Textarea
                  placeholder="Describe the purpose of this routine..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Thumbnail */}
        <input
          type="file"
          accept="image/*"
          ref={thumbnailRef}
          onChange={handleThumbnailChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => thumbnailRef.current?.click()}
        >
          Upload Thumbnail
        </Button>
        {thumbnailPreview && (
          <div className="relative w-full sm:w-64 mt-2">
            <img
              src={thumbnailPreview}
              alt="Thumbnail preview"
              className="w-full h-40 object-cover border rounded-md"
            />
            <button
              type="button"
              className="absolute top-2 right-2 bg-red-600 text-white rounded p-1"
              onClick={cancelThumbnail}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Routines List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Routine Entries</h3>
            <Button
              type="button"
              variant="ghost"
              onClick={() => append({ time: "", content: "" })}
              className="gap-1"
            >
              <Plus size={16} /> Add Entry
            </Button>
          </div>

          {routineFields.map((routine, index) => (
            <div
              key={routine.id}
              className="p-4 border rounded-md bg-muted/20 relative space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`routines.${index}.time`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 08:00 AM"
                          type="time"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`routines.${index}.content`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What should be done at this time?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {routineFields.length > 1 && (
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-600 text-white rounded p-1"
                  onClick={() => remove(index)}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full">
          Save Routine
        </Button>
      </form>
    </Form>
  );
};

export default AddRoutineForm;
