import React, { use } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import dayjs from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

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
        filters: ["all", "ayurveda"],
      };

      console.log("New Post : ", newPost);
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
              className="p-4 border rounded-2xl bg-muted/20 relative space-y-4 shadow-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                {/* TIME PICKER */}
                <FormField
                  control={form.control}
                  name={`routines.${index}.time`}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <TimePicker
                        ampm
                        value={
                          field.value ? dayjs(field.value, "hh:mm A") : null
                        }
                        onChange={(val) =>
                          field.onChange(val ? val.format("hh:mm A") : null)
                        }
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            variant: "outlined",
                            placeholder: "e.g. 08:00 AM",
                            error: !!fieldState.error,
                            helperText: fieldState.error?.message,
                          },
                        }}
                      />
                    </FormItem>
                  )}
                />

                {/* CONTENT FIELD */}
                <FormField
                  control={form.control}
                  name={`routines.${index}.content`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What should be done at this time?"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* REMOVE BUTTON */}
              {routineFields.length > 1 && (
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 transition text-white rounded-full p-1.5 shadow"
                  onClick={() => remove(index)}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          variant={"outline"}

        >
          Save Routine
        </Button>
      </form>
    </Form>
  );
};

export default AddRoutineForm;
