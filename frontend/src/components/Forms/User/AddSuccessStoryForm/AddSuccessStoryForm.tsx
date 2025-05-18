import type React from "react";
import { useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, X, ImageIcon, FileText, Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon, Add as AddIcon } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import formSchema from "./AddSuccessStoryFormSchema";
import { Doctor } from "./AddSuccessStoryFormSchema.types";
import useApi from "@/hooks/useApi/useApi";
import usePost from "@/hooks/usePost/usePost";
import { useNavigate } from "react-router-dom";
import useSuccessStory from "@/hooks/useSuccessStory/useSuccessStory";

type FormValues = z.infer<typeof formSchema>;

export interface ExpertProfile {
  expertType: "ayurvedic" | "naturopathy" | string; // add other types if needed
  profileImage: string;
}

export interface Expert {
  _id: string;
  username: string;
  profile: ExpertProfile;
}

export default function AddSuccessStoryForm() {
  const { get } = useApi();
  const { submitSuccessStory } = useSuccessStory();
  const navigate = useNavigate();

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const docInputRef = useRef<HTMLInputElement | null>(null);

  const [mediaPreview, setMediaPreview] = useState<{
    images: string[];
    video: string | null;
    document: string | null;
  }>({
    images: [],
    video: null,
    document: null,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Doctor[]>([]);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      media: {
        images: [],
        video: null,
        document: null,
      },
      hasRoutines: false,
      routines: undefined,
      tagged: [],
    },
  });

  // Set up field array for routines
  const {
    fields: routineFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "routines",
  });

  const onSubmit = async (formData: FormValues) => {
    try {
      const newSuccessStoryData = {
        title: formData.title,
        description: formData.description,
        media: {
          images: formData.media?.images,
          video: formData.media?.video,
          document: formData.media?.document,
        },
        routines: formData.hasRoutines ? formData.routines ?? [] : [],
        tagged: formData.tagged.map((taggedDoctor) => taggedDoctor.id),
      };
      console.log("New Post : ", newSuccessStoryData);
      const response = await submitSuccessStory(newSuccessStoryData);
      if (response?.success) {
        form.reset();
        navigate(`/success-stories/${response?.postId}`);
      }
    } catch (error: any) {
      console.error("Post failed:", error.message);
      if (error.status === 401) navigate("/auth");
      else if (error.status === 403) navigate("/");
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // Fake doctor search
  const searchDoctors = async (query: string) => {
    setIsSearching(true);
    console.log("Searching for doctors:", query);

    // Simulate API call
    const response = await get(
      `${import.meta.env.VITE_SERVER_URL}/api/experts/search/doctors`,
      {
        params: { q: query },
      }
    );

    console.log("Doctor search response:", response);

    const doctors = response.doctors.map((doctor: Expert) => ({
      id: doctor._id,
      name: doctor.username,
      avatar:
        doctor.profile.profileImage || "/placeholder.svg?height=40&width=40",
    }));

    setSearchResults(doctors);
    setIsSearching(false);
  };

  // Handle doctor selection
  const selectDoctor = (doctor: Doctor) => {
    const currentDoctors = form.getValues("tagged") || [];

    // Check if doctor is already selected
    if (currentDoctors.some((d) => d.id === doctor.id)) return;

    // Check if we've reached the maximum number of doctors
    if (currentDoctors.length >= 5) {
      form.setError("tagged", {
        type: "manual",
        message: "You can select up to 5 doctors",
      });
      return;
    }

    form.setValue("tagged", [...currentDoctors, doctor]);
    form.clearErrors("tagged");
  };

  // Handle doctor removal
  const removeDoctor = (doctorId: string) => {
    const currentDoctors = form.getValues("tagged") || [];
    form.setValue(
      "tagged",
      currentDoctors.filter((d) => d.id !== doctorId)
    );
  };

  return (
    <div className="container  w-screen mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Add Success Story</h1>

      <Card className="shadow-md">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter success story title"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Give your success story a compelling title
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the success story in detail"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed description of the success story
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Media Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Media Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Upload images, a video, or a document to accompany your
                  success story
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Images Upload */}
                  <div>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 h-32 hover:bg-muted/50 transition-colors cursor-pointer">
                      <label
                        htmlFor="images-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm font-medium">
                          Upload Images
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Multiple allowed
                        </span>
                      </label>
                      <input
                        id="images-upload"
                        type="file"
                        ref={imageInputRef}
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImagesChange}
                      />
                    </div>
                  </div>

                  {/* Video Upload */}
                  <div>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 h-32 hover:bg-muted/50 transition-colors cursor-pointer">
                      <label
                        htmlFor="video-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Video className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm font-medium">
                          Upload Video
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Single file
                        </span>
                      </label>
                      <input
                        id="video-upload"
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleVideoChange}
                      />
                    </div>
                  </div>

                  {/* Document Upload */}
                  <div>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 h-32 hover:bg-muted/50 transition-colors cursor-pointer">
                      <label
                        htmlFor="document-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm font-medium">
                          Upload Document
                        </span>
                        <span className="text-xs text-muted-foreground">
                          PDF only
                        </span>
                      </label>
                      <input
                        id="document-upload"
                        ref={docInputRef}
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleDocumentChange}
                      />
                    </div>
                  </div>
                </div>

                {mediaPreview.images?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Image Previews</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {mediaPreview.images?.map((url, index) => (
                        <div
                          key={index}
                          className="relative rounded-md overflow-hidden h-24"
                        >
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                            onClick={() => {
                              handleImagePreviewCancel(index);
                            }}
                          >
                            <X size={16} />
                          </button>
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-black/70 rounded-full p-1"
                            onClick={() => {
                              handleImagePreviewCancel(index);
                            }}
                          >
                            <X className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {mediaPreview.video && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Video Preview</h4>
                    <div className="relative rounded-md overflow-hidden">
                      <video
                        src={mediaPreview.video}
                        controls
                        className="w-full max-h-[300px]"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-black/70 rounded-full p-1"
                        onClick={handleVideoPreviewCancel}
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                )}

                {mediaPreview.document && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">
                      Document Preview
                    </h4>
                    <div className="flex items-center p-3 border rounded-md">
                      <FileText className="h-6 w-6 mr-2 text-muted-foreground" />
                      <span className="text-sm truncate flex-1">
                        {form.getValues("media.document")?.name || "Document"}
                      </span>
                      <button
                        type="button"
                        className="ml-2 text-muted-foreground hover:text-foreground"
                        onClick={handleDocPreviewCancel}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Routines Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="hasRoutines"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.checked);
                              if (e.target.checked) {
                                form.setValue("routines", [
                                  {
                                    time: "",
                                    content: "",
                                  },
                                ]);
                              }
                              if (!e.target.checked) {
                                form.setValue("routines", undefined);
                              }
                              // <Checkbox
                              //   checked={field.value}
                              //   onChange={(e) => {
                              //     const checked = e.target.checked;
                              //     field.onChange(checked);

                              //     form.setValue(
                              //       "routines",
                              //       checked
                              //         ? [{ time: "", content: "" }]
                              //         : undefined,
                              //       {
                              //         shouldDirty: true,
                              //         shouldTouch: true,
                              //         shouldValidate: true,
                              //       }
                              //     );
                              //   }}
                              // />;
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Include Routines</FormLabel>
                          <FormDescription>
                            Add daily routines that contributed to the success
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch("hasRoutines") && (
                  <div className="space-y-4 pl-6 border-l-2 border-muted">
                    {routineFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-4 items-start"
                      >
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
                                  field.value
                                    ? dayjs(field.value, "hh:mm A")
                                    : null
                                }
                                onChange={(val) =>
                                  field.onChange(
                                    val ? val.format("hh:mm A") : null
                                  )
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

                        <FormField
                          control={form.control}
                          name={`routines.${index}.content`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe the routine"
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <IconButton
                          color="default"
                          onClick={() => remove(index)}
                          disabled={routineFields.length === 1}
                          sx={{ marginTop: "8px" }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </div>
                    ))}

                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => append({ time: "", content: "" })}
                      sx={{ marginTop: "8px" }}
                    >
                      Add Routine
                    </Button>
                  </div>
                )}
              </div>

              {/* Doctor Tagging Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Doctor Tagging</h3>
                <p className="text-sm text-muted-foreground">
                  Tag up to 5 doctors who contributed to this success story
                </p>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outlined" startIcon={<AddIcon />}>
                      Add Doctors
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Search Doctors</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Search by name"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={() => searchDoctors(searchQuery)}
                          disabled={isSearching || searchQuery.length < 2}
                        >
                          {isSearching ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Search"
                          )}
                        </Button>
                      </div>

                      {form.formState.errors.tagged && (
                        <Alert variant="destructive">
                          <AlertDescription>
                            {form.formState.errors.tagged.message}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="max-h-[300px] overflow-y-auto">
                        {isSearching ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                          </div>
                        ) : searchResults.length > 0 ? (
                          <div className="space-y-2">
                            {searchResults.map((doctor) => (
                              <div
                                key={doctor.id}
                                className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
                                onClick={() => selectDoctor(doctor)}
                              >
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <img
                                      src={doctor.avatar || "/placeholder.svg"}
                                      alt={doctor.name}
                                    />
                                  </Avatar>
                                  <span>{doctor.name}</span>
                                </div>
                                <Button
                                  type="button"
                                  variant="outlined"
                                  disabled={form
                                    .getValues("tagged")
                                    ?.some((d) => d.id === doctor.id)}
                                >
                                  {form
                                    .getValues("tagged")
                                    ?.some((d) => d.id === doctor.id)
                                    ? "Added"
                                    : "Add"}
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : searchQuery.length > 0 ? (
                          <p className="text-center py-8 text-muted-foreground">
                            No doctors found
                          </p>
                        ) : (
                          <p className="text-center py-8 text-muted-foreground">
                            Search for doctors by name
                          </p>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {form.watch("tagged")?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("tagged").map((doctor) => (
                      <Chip
                        key={doctor.id}
                        avatar={
                          <Avatar
                            src={doctor.avatar || "/placeholder.svg"}
                            alt={doctor.name}
                          />
                        }
                        label={doctor.name}
                        variant="outlined"
                        onDelete={() => removeDoctor(doctor.id)}
                        deleteIcon={<CloseIcon fontSize="small" />}
                      />
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                disabled={form.formState.isSubmitting}
                fullWidth
                startIcon={
                  form.formState.isSubmitting ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : null
                }
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Success Story"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
