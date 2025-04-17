// import React, { useRef, useState, useEffect } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useNavigate } from "react-router-dom";
// import { X, Loader2 } from "lucide-react";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";

// import {
//   Button as MuiButton,
//   TextField,
//   Chip,
//   Avatar,
//   CircularProgress,
// } from "@mui/material";

// import UploadIcon from "@mui/icons-material/Upload";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddIcon from "@mui/icons-material/Add";
// import SearchIcon from "@mui/icons-material/Search";

// import usePost from "@/hooks/usePost/usePost";
// import { TimePicker } from "@mui/x-date-pickers/TimePicker";
// import dayjs from "dayjs";

// const formSchema = z.object({
//   title: z.string().min(1),
//   description: z.string().min(1),
//   media: z.object({
//     images: z.array(z.instanceof(File)).max(3),
//     video: z.any().nullable(),
//     document: z.any().nullable(),
//   }),
//   routines: z
//     .array(
//       z.object({
//         time: z.string().min(1),
//         content: z.string().min(1),
//       })
//     )
//     .optional(),
//   includeRoutines: z.boolean().default(false),
//   taggedDoctors: z.array(z.string()).max(5),
// });

// const AddSuccessStoryForm = () => {
//   const { submitPost } = usePost();
//   const navigate = useNavigate();

//   const [preview, setPreview] = useState<{
//     images: string[];
//     video: string | null;
//     document: string | null;
//   }>({
//     images: [],
//     video: null,
//     document: null,
//   });

//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchResults, setSearchResults] = useState<any[]>([]);
//   const [loadingSearch, setLoadingSearch] = useState(false);

//   const imageRef = useRef<HTMLInputElement>(null);
//   const videoRef = useRef<HTMLInputElement>(null);
//   const docRef = useRef<HTMLInputElement>(null);

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       media: { images: [], video: null, document: null },
//       includeRoutines: false,
//       routines: [{ time: "", content: "" }],
//       taggedDoctors: [],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control: form.control,
//     name: "routines",
//   });

//   const handleMediaChange = (
//     type: "image" | "video" | "document",
//     files: FileList | null
//   ) => {
//     if (!files) return;
//     if (type === "image") {
//       const imgs = Array.from(files);
//       form.setValue("media.images", imgs);
//       form.setValue("media.video", null);
//       form.setValue("media.document", null);

//       const filePreview = imgs.map((file) => URL.createObjectURL(file));
//       setPreview({ images: filePreview, video: null, document: null });
//     } else if (type === "video") {
//       const file = files[0];
//       form.setValue("media.video", file);
//       form.setValue("media.images", []);
//       form.setValue("media.document", null);
//       setPreview({
//         images: [],
//         video: URL.createObjectURL(file),
//         document: null,
//       });
//     } else {
//       const file = files[0];
//       form.setValue("media.document", file);
//       form.setValue("media.video", null);
//       form.setValue("media.images", []);
//       setPreview({
//         images: [],
//         video: null,
//         document: URL.createObjectURL(file),
//       });
//     }
//   };

//   const handleSearch = async () => {
//     setLoadingSearch(true);
//     await new Promise((r) => setTimeout(r, 1000));
//     setSearchResults(
//       ["Dr. John Smith", "Dr. Jane Doe", "Dr. Priya Patel", "Dr. Alex Roy"].map(
//         (name, i) => ({
//           id: `doc-${i + 1}`,
//           name,
//           avatar: `https://i.pravatar.cc/150?img=${i + 5}`,
//         })
//       )
//     );
//     setLoadingSearch(false);
//   };

//   const handleDoctorSelect = (doctorId: string) => {
//     const current = form.getValues("taggedDoctors");
//     if (current.includes(doctorId)) {
//       form.setValue(
//         "taggedDoctors",
//         current.filter((id) => id !== doctorId)
//       );
//     } else if (current.length < 5) {
//       form.setValue("taggedDoctors", [...current, doctorId]);
//     }
//   };

//   const onSubmit = async (data: any) => {
//     try {
//       console.log("Success Story Data", data);
//       //   const response = await submitPost(data);
//       //   if (response?.success) {
//       //     form.reset();
//       //     navigate(`/expert/posts/${response.postId}`);
//       //   }
//     } catch (error: any) {
//       console.error("Post failed:", error.message);
//     }
//   };

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="space-y-6 max-w-3xl mx-auto p-6 bg-white rounded-xl shadow"
//       >
//         <FormField
//           control={form.control}
//           name="title"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Title</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter story title" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Description</FormLabel>
//               <FormControl>
//                 <Textarea placeholder="Write your story..." {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <input
//           ref={imageRef}
//           type="file"
//           accept="image/*"
//           multiple
//           className="hidden"
//           onChange={(e) => handleMediaChange("image", e.target.files)}
//         />
//         <input
//           ref={videoRef}
//           type="file"
//           accept="video/*"
//           className="hidden"
//           onChange={(e) => handleMediaChange("video", e.target.files)}
//         />
//         <input
//           ref={docRef}
//           type="file"
//           accept=".pdf"
//           className="hidden"
//           onChange={(e) => handleMediaChange("document", e.target.files)}
//         />

//         <div className="flex flex-wrap gap-3">
//           <MuiButton
//             onClick={() => imageRef.current?.click()}
//             startIcon={<UploadIcon />}
//           >
//             Upload Images
//           </MuiButton>
//           <MuiButton
//             onClick={() => videoRef.current?.click()}
//             startIcon={<UploadIcon />}
//           >
//             Upload Video
//           </MuiButton>
//           <MuiButton
//             onClick={() => docRef.current?.click()}
//             startIcon={<UploadIcon />}
//           >
//             Upload Document
//           </MuiButton>
//         </div>

//         {preview.images.length > 0 && (
//           <div className="grid grid-cols-2 gap-4">
//             {preview.images.map((img, i) => (
//               <img
//                 key={i}
//                 src={img}
//                 className="rounded shadow h-40 object-cover"
//               />
//             ))}
//           </div>
//         )}
//         {preview.video && (
//           <video controls className="w-full max-h-64 rounded shadow">
//             <source src={preview.video} />
//           </video>
//         )}
//         {preview.document && (
//           <div className="mt-2">📄 {form.getValues("media.document").name}</div>
//         )}

//         <FormField
//           control={form.control}
//           name="includeRoutines"
//           render={({ field }) => (
//             <FormItem>
//               <FormControl>
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={field.value}
//                     onChange={field.onChange}
//                   />
//                   Share my routines
//                 </label>
//               </FormControl>
//             </FormItem>
//           )}
//         />

//         {form.watch("includeRoutines") && (
//           <div className="space-y-4">
//             <h4 className="text-lg font-semibold">Routine Entries</h4>
//             {fields.map((item, index) => (
//               <div
//                 key={item.id}
//                 className="grid grid-cols-1 sm:grid-cols-2 gap-4"
//               >
//                 <FormField
//                   control={form.control}
//                   name={`routines.${index}.time`}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Time</FormLabel>
//                       <TimePicker
//                         ampm
//                         value={
//                           field.value ? dayjs(field.value, "hh:mm A") : null
//                         }
//                         onChange={(val) =>
//                           field.onChange(val?.format("hh:mm A") || "")
//                         }
//                         slotProps={{
//                           textField: { fullWidth: true },
//                         }}
//                       />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name={`routines.${index}.content`}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Content</FormLabel>
//                       <FormControl>
//                         <Textarea placeholder="Routine details..." {...field} />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             ))}
//             <MuiButton
//               onClick={() => append({ time: "", content: "" })}
//               startIcon={<AddIcon />}
//             >
//               Add Routine
//             </MuiButton>
//           </div>
//         )}

//         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//           <DialogTrigger asChild>
//             <MuiButton variant="outlined">Tag a Doctor</MuiButton>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Search and Tag Doctors</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4">
//               <TextField
//                 fullWidth
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//                 placeholder="Search doctors by name"
//                 InputProps={{
//                   endAdornment: loadingSearch ? (
//                     <CircularProgress size={20} />
//                   ) : (
//                     <SearchIcon />
//                   ),
//                 }}
//               />
//               <div className="grid gap-2">
//                 {searchResults.map((doc) => (
//                   <div
//                     key={doc.id}
//                     onClick={() => handleDoctorSelect(doc.id)}
//                     className={`flex items-center gap-4 p-2 border rounded cursor-pointer hover:bg-gray-100 ${
//                       form.getValues("taggedDoctors").includes(doc.id)
//                         ? "bg-blue-100"
//                         : ""
//                     }`}
//                   >
//                     <Avatar src={doc.avatar} />
//                     <span>{doc.name}</span>
//                   </div>
//                 ))}
//               </div>
//               <div className="flex gap-2 flex-wrap">
//                 {form.watch("taggedDoctors").map((id) => {
//                   const doc = searchResults.find((d) => d.id === id);
//                   return doc ? (
//                     <Chip
//                       key={id}
//                       label={doc.name}
//                       onDelete={() => handleDoctorSelect(id)}
//                     />
//                   ) : null;
//                 })}
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>

//         <MuiButton
//           type="submit"
//           variant="contained"
//           color="primary"
//           fullWidth
//           disabled={form.formState.isSubmitting}
//         >
//           {form.formState.isSubmitting ? (
//             <Loader2 className="animate-spin" />
//           ) : (
//             "Submit Success Story"
//           )}
//         </MuiButton>
//       </form>
//     </Form>
//   );
// };

// export default AddSuccessStoryForm;

"use client";

import type React from "react";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, X, ImageIcon, FileText, Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, Chip, CircularProgress, IconButton } from "@mui/material";
import { Close as CloseIcon, Add as AddIcon } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";

// Define the Doctor type
interface Doctor {
  id: string;
  name: string;
  avatar: string;
}

// Define the form schema with zod
const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  mediaType: z.enum(["images", "video", "document"]).optional(),
  images: z.array(z.instanceof(File)).optional(),
  video: z.instanceof(File).optional(),
  document: z.instanceof(File).optional(),
  hasRoutines: z.boolean().default(false),
  routines: z
    .array(
      z.object({
        time: z.any().optional(), // We'll validate this separately
        description: z.string().min(3, {
          message: "Routine description must be at least 3 characters",
        }),
      })
    )
    .optional(),
  doctors: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        avatar: z.string(),
      })
    )
    .max(5, { message: "You can select up to 5 doctors" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddSuccessStoryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [documentPreviewUrl, setDocumentPreviewUrl] = useState<string | null>(
    null
  );
  const [documentName, setDocumentName] = useState<string | null>(null);
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
      mediaType: undefined,
      images: [],
      video: undefined,
      document: undefined,
      hasRoutines: false,
      routines: [{ time: dayjs(), description: "" }],
      doctors: [],
    },
  });

  // Set up field array for routines
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "routines",
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    console.log("Form data:", data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    alert("Success story submitted successfully!");
    form.reset();
    setImagePreviewUrls([]);
    setVideoPreviewUrl(null);
    setDocumentPreviewUrl(null);
    setDocumentName(null);
  };

  // Handle image upload
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Reset other media types
    form.setValue("video", undefined);
    form.setValue("document", undefined);
    form.setValue("mediaType", "images");
    setVideoPreviewUrl(null);
    setDocumentPreviewUrl(null);
    setDocumentName(null);

    // Set images and create preview URLs
    const fileArray = Array.from(files);
    form.setValue("images", fileArray);

    // Create preview URLs
    const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls(previewUrls);
  };

  // Handle video upload
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Reset other media types
    form.setValue("images", []);
    form.setValue("document", undefined);
    form.setValue("mediaType", "video");
    setImagePreviewUrls([]);
    setDocumentPreviewUrl(null);
    setDocumentName(null);

    // Set video and create preview URL
    const file = files[0];
    form.setValue("video", file);
    setVideoPreviewUrl(URL.createObjectURL(file));
  };

  // Handle document upload
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Reset other media types
    form.setValue("images", []);
    form.setValue("video", undefined);
    form.setValue("mediaType", "document");
    setImagePreviewUrls([]);
    setVideoPreviewUrl(null);

    // Set document and create preview URL
    const file = files[0];
    form.setValue("document", file);
    setDocumentName(file.name);
    setDocumentPreviewUrl(URL.createObjectURL(file));
  };

  // Fake doctor search
  const searchDoctors = async (query: string) => {
    setIsSearching(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate fake results
    const fakeResults: Doctor[] = [
      {
        id: "1",
        name: "Dr. John Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "2",
        name: "Dr. Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "3",
        name: "Dr. Michael Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "4",
        name: "Dr. Emily Davis",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "5",
        name: "Dr. Robert Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "6",
        name: "Dr. Jennifer Lee",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ].filter((doctor) =>
      doctor.name.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(fakeResults);
    setIsSearching(false);
  };

  // Handle doctor selection
  const selectDoctor = (doctor: Doctor) => {
    const currentDoctors = form.getValues("doctors") || [];

    // Check if doctor is already selected
    if (currentDoctors.some((d) => d.id === doctor.id)) return;

    // Check if we've reached the maximum number of doctors
    if (currentDoctors.length >= 5) {
      form.setError("doctors", {
        type: "manual",
        message: "You can select up to 5 doctors",
      });
      return;
    }

    form.setValue("doctors", [...currentDoctors, doctor]);
    form.clearErrors("doctors");
  };

  // Handle doctor removal
  const removeDoctor = (doctorId: string) => {
    const currentDoctors = form.getValues("doctors") || [];
    form.setValue(
      "doctors",
      currentDoctors.filter((d) => d.id !== doctorId)
    );
  };

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
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
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleDocumentChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Media Previews */}
                {imagePreviewUrls.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Image Previews</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {imagePreviewUrls.map((url, index) => (
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
                            className="absolute top-1 right-1 bg-black/70 rounded-full p-1"
                            onClick={() => {
                              const newImages = [
                                ...(form.getValues("images") || []),
                              ];
                              newImages.splice(index, 1);
                              form.setValue("images", newImages);

                              const newUrls = [...imagePreviewUrls];
                              URL.revokeObjectURL(newUrls[index]);
                              newUrls.splice(index, 1);
                              setImagePreviewUrls(newUrls);

                              if (newUrls.length === 0) {
                                form.setValue("mediaType", undefined);
                              }
                            }}
                          >
                            <X className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {videoPreviewUrl && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Video Preview</h4>
                    <div className="relative rounded-md overflow-hidden">
                      <video
                        src={videoPreviewUrl}
                        controls
                        className="w-full max-h-[300px]"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-black/70 rounded-full p-1"
                        onClick={() => {
                          form.setValue("video", undefined);
                          form.setValue("mediaType", undefined);
                          URL.revokeObjectURL(videoPreviewUrl);
                          setVideoPreviewUrl(null);
                        }}
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                )}

                {documentPreviewUrl && documentName && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">
                      Document Preview
                    </h4>
                    <div className="flex items-center p-3 border rounded-md">
                      <FileText className="h-6 w-6 mr-2 text-muted-foreground" />
                      <span className="text-sm truncate flex-1">
                        {documentName}
                      </span>
                      <button
                        type="button"
                        className="ml-2 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          form.setValue("document", undefined);
                          form.setValue("mediaType", undefined);
                          URL.revokeObjectURL(documentPreviewUrl);
                          setDocumentPreviewUrl(null);
                          setDocumentName(null);
                        }}
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
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              if (!checked) {
                                form.setValue("routines", [
                                  { time: dayjs(), description: "" },
                                ]);
                              }
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
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-4 items-start"
                      >
                        <Controller
                          control={form.control}
                          name={`routines.${index}.time`}
                          render={({ field }) => (
                            //  <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              label="Time"
                              value={field.value}
                              onChange={(newValue) => field.onChange(newValue)}
                              slotProps={{
                                textField: {
                                  size: "small",
                                  error:
                                    !!form.formState.errors.routines?.[index]
                                      ?.time,
                                  // helperText: form.formState.errors.routines?.[index]?.time?.message,
                                },
                              }}
                            />
                            //    </LocalizationProvider>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`routines.${index}.description`}
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
                          disabled={fields.length === 1}
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
                      onClick={() => append({ time: dayjs(), description: "" })}
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

                      {form.formState.errors.doctors && (
                        <Alert variant="destructive">
                          <AlertDescription>
                            {form.formState.errors.doctors.message}
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
                                  variant="ghost"
                                  size="sm"
                                  disabled={form
                                    .getValues("doctors")
                                    ?.some((d) => d.id === doctor.id)}
                                >
                                  {form
                                    .getValues("doctors")
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

                {form.watch("doctors")?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("doctors").map((doctor) => (
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
                disabled={isSubmitting}
                fullWidth
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : null
                }
              >
                {isSubmitting ? (
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
