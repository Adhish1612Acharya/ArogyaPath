import React, { useRef, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useRoutes } from "react-router-dom";
import { X, Plus, Loader2 } from "lucide-react";

// ShadCN components
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

// Material UI
import MuiButton from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";

// Custom logic
import usePost from "@/hooks/usePost/usePost";
import addRoutineFormSchema from "./AddRoutineFormSchema";
import dayjs from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import useRoutines from "@/hooks/useRoutine/useRoutine";

type RoutineFormSchema = z.infer<typeof addRoutineFormSchema>;

const AddRoutineForm = () => {
  const { submitRoutinePost } = useRoutines();
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
    thumbnailRef.current!.value = ""; // Clear the input value to allow re-uploading the same file
  };

  const cancelThumbnail = () => {
    URL.revokeObjectURL(thumbnailPreview!); // Revoke the object URL to free up memory
    form.setValue("thumbnail", null);
    setThumbnailPreview(null);
  };

  const onSubmit = async (newRoutinePostData: RoutineFormSchema) => {
    try {
      console.log("New Post : ", newRoutinePostData);
      const response = await submitRoutinePost(newRoutinePostData);
      if (response?.success) {
        form.reset();
        navigate(`/routines/${response?.postId}`);
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
        className="space-y-8 max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8"
      >
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Routine Title
              </FormLabel>
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
              <FormLabel className="text-base font-semibold">
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the purpose of this routine..."
                  className="min-h-[120px]"
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
        <MuiButton
          variant="outlined"
          startIcon={<UploadIcon />}
          onClick={() => thumbnailRef.current?.click()}
        >
          Upload Thumbnail
        </MuiButton>
        {thumbnailPreview && (
          <div className="relative mt-4 w-full sm:w-64">
            <img
              src={thumbnailPreview}
              alt="Thumbnail preview"
              className="w-full h-40 object-cover border rounded-md"
            />
            <button
              type="button"
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
              onClick={cancelThumbnail}
            >
              <X size={16} className="text-black" />
            </button>
          </div>
        )}

        {/* Routine Entries */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Routine Entries</h3>
            <MuiButton
              variant="text"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => append({ time: "", content: "" })}
            >
              Add Entry
            </MuiButton>
          </div>

          {routineFields.map((routine, index) => (
            <div
              key={routine.id}
              className="p-4 border rounded-md bg-muted/10 relative space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 hover:bg-red-700 transition text-white rounded-full-full p-1.5 shadow"
                  onClick={() => remove(index)}
                >
                  <DeleteIcon fontSize="small" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <MuiButton
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          style={{ marginTop: "20px" }}
        >
          {form.formState.isSubmitting ? <Loader2 /> : "Post Routine"}
        </MuiButton>
      </form>
    </Form>
  );
};

export default AddRoutineForm;
