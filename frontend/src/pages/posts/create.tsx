import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Image as ImageIcon,
  Video,
  FileText,
  Trash2,
  Clock
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Footer } from "@/components/layout/footer";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import filters from "@/constants";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Button as Button2 } from "@mui/material";

// Initialize the API with your Gemini API Key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API);

// Define the model
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

interface Tag {
  id: string;
  text: string;
}

interface RoutineActivity {
  id: string;
  time: string;
  activity: string;
}

export function CreatePostPage() {
  const [postType, setPostType] = useState<"general" | "routine">("general");
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [document, setDocument] = useState<File | null>(null);
  const [routineActivities, setRoutineActivities] = useState<RoutineActivity[]>(
    []
  );
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.find((tag) => tag.text === tagInput.trim())) {
        setTags([
          ...tags,
          { id: Date.now().toString(), text: tagInput.trim() },
        ]);
      }
      setTagInput("");
    }
  };

  const handleDragStart = (index: number) => {
    setRoutineActivities((prev) => {
      const newActivities = [...prev];
      const [draggedActivity] = newActivities.splice(index, 1);
      newActivities.push(draggedActivity);
      return newActivities;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeActivity = (index: number) => {
    setRoutineActivities(routineActivities.filter((_, i) => i !== index));
  };

  const addActivity = () => {
    setRoutineActivities([
      ...routineActivities,
      { id: Date.now().toString(), time: "", activity: "" },
    ]);
  };

  const handleFileChange = (
    file: File | null,
    type: "image" | "video" | "document"
  ) => {
    setImage(null);
    setVideo(null);
    setDocument(null);
    if (type === "image") setImage(file);
    if (type === "video") setVideo(file);
    if (type === "document") setDocument(file);
  };

  const uploadFilesToCloudinary = async (file: any): Promise<string | null> => {
    const cloudinaryUrl = file.type.startsWith("video/")
      ? "https://api.cloudinary.com/v1_1/daawurvug/video/upload"
      : file.type === "application/pdf"
      ? "https://api.cloudinary.com/v1_1/daawurvug/raw/upload"
      : "https://api.cloudinary.com/v1_1/daawurvug/image/upload";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "fu6t0ggw");
    formData.append("folder", "GSC_DEV");

    try {
      const response = await axios.post(cloudinaryUrl, formData);
      console.log("Cloudonary response : ", response);
      return response.data.secure_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const convertToBase64 = (file: any): any => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const classifyContentAndVerify = async (
    title: string,
    content: any,
    media: any,
    existingFilters: any
  ) => {
    try {
      const prompt = `
       You are an AI assistant specializing Ayurveda or naturopathy. 
    1.Your task is to  Validate if a post is relevant to Ayurveda or  naturopathy
    2. If relevant, apply predefined filters to categorize the posts else retuen the reponse
      You are an AI assistant specializing in content classification.  
      Your task is to categorize a given post into one or more **predefined filters**.
      
      ### **Input Data**
      -Post title : "${title}"
      - Post Description: "${content}"
      - Media (image, document, or video): "${media}" 
      - Available Filters: ${JSON.stringify(existingFilters)}
      
      ### **Task Requirements**
      1. **Select Only from Existing Filters**:  
         - The response **must include at least one filter** from the predefined filters.
         - **Do not create or suggest new filters.**
         - Match the post content **only** to the most relevant existing sub-filters.

         RULES:
- Return ONLY pure JSON output (no explanations, markdown, or extra text)
- For irrelevant posts: {"filters": [], "verified": "false"}
- For relevant posts: {"filters": ["sub-filter1", "sub-filter2"], "verified": "true"}
- NEVER include parent categories in filters (e.g., don't use "HealthConcerns", only its sub-filters like "Immunity Boosting")
- NEVER invent new filters - only use provided sub-filters
- When in doubt, mark as "verified": "false"
      
      2. **Strictly Return Valid JSON**:  
         - The response must be a **pure JSON object** with no markdown, explanations, or extra formatting.  
         - The JSON output **must be parsable** without backticks or surrounding text.
      
      ### **Expected JSON Response Format**
    {
      "filters": [],
      "verified": "false"
    }
  
      {
        "filters": ["At least one relevant existing sub-filter"]
          "verified": "true"
      }
      
      - The **"filters" array must never be empty if the post is valid**.
      - **Only return predefined sub-filters**—do not generate new ones.
      - Ensure accuracy—**false positives are worse than false negatives**.
      `;

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      });

      // Extract and return the response
      const response = await result.response;
      console.log("Filters : ", response.text());
      return response.text(); // Ensure this returns a string
    } catch (error) {
      console.error("Error generating content: ", error);
      throw new Error("Failed to classify content.");
    }
  };

  const classifyRoutines = async (
    routineActivities: any,
    existingFilters: any
  ) => {
    try {
      const prompt = `
          You are an Ayurvedic content classification AI. Analyze RoutineActivity arrays and return ONLY sub-filter matches.
          
          ### STRICT RULES:
          1. INPUT:
          - routines: ${JSON.stringify(routineActivities)} 
          - Available SUB-FILTERS ONLY: ${JSON.stringify(
            Object.values(existingFilters).flatMap(
              (category) => (category as any).subFilters
            )
          )}
          
          2. PROCESSING:
          - For EACH routine.activity:
            a) FIRST check for EXACT matches to sub-filters
            b) Then check for CONCEPT matches 
            c) REJECT if no Ayurvedic/Naturopathic content found
          
          3. OUTPUT REQUIREMENTS:
          - Return PURE JSON with this EXACT structure:
          
            {
            "filters": ["Sub-filter1","Sub-Filter2],
          }
          
          - NEVER include:
            * Parent categories (e.g., "TreatmentApproach")
            * Empty filters array when verified=true
            * Explanations or markdown
          
          4. TIME-BASED PRIORITIES:
          - Morning (5-10am): Prioritize "Detox Therapies", "Yoga Postures"
          - Evening (6-9pm): Prioritize "Relaxation Techniques", "Herbal Sleep Aids"
          - Meal times: Prioritize "Dietary Recommendations"
          `;
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      });

      // Extract and return the response
      const response = await result.response;
      console.log("Filters : ", response.text());
      return response.text(); // Ensure this returns a string
    } catch (error) {
      console.error("Error generating content: ", error);
      throw new Error("Failed to classify content.");
    }
  };

  const convertTo12Hour = (time24: any, locale = "en-US") =>
    new Date(`1970-01-01T${time24}:00`).toLocaleTimeString(locale, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const handleSubmit = async () => {
    try {
      console.log("PostType : ", postType);
      if (postType === "general") {
        if (title === "" || content === "") {
          toast.info("Please enter a valid title and content");
          return;
        }
        let base64Url = "";
        let mediaUrl: any = "";
        setLoading(true);
        const relevanceCheck: any = await axios.post(
          "https://content-verification-aakrithi.onrender.com/predict",
          { text: content }
        );
        console.log("Relevance check ", relevanceCheck.data);

        if (image || video || document) {
          base64Url = await convertToBase64(image || video || document);
        }

        const aiFiltration = await classifyContentAndVerify(
          title,
          content,
          base64Url,
          filters
        );

        const cleanResponse = aiFiltration?.replace(/```json|```/g, "");

        const jsonData: any = JSON.parse(cleanResponse);

        if (relevanceCheck.data.prediction === "Non-Ayurveda") {
          toast.error("Invalid post");
          return;
        }

        // if (jsonData.verified === "false" || jsonData.verified === false) {
        //   toast.error("Please enter a valid Ayurveda/Naturopathy content");
        //   setLoading(false);
        //   return;
        // }

        if (image || video || document) {
          mediaUrl = await uploadFilesToCloudinary(image || video || document);
        }
        const data = {
          title,
          description: content,
          media: {
            image: image ? [mediaUrl] : [],
            video: video ? [mediaUrl] : [],
            document: document ? [mediaUrl] : [],
          },
          category: jsonData.filters,
          successStory: false,
          ownerType: "Expert",
          tags: [],
          verified: null,
          routine: [],
        };

        console.log("Data : ", data);

        const response = await axios.post(
          "http://localhost:3000/api/post",
          data,
          { withCredentials: true }
        );
        console.log("Reponse from express : ", response);
        toast.success("Post created successfully");
        setLoading(false);
      } else if (postType === "routine") {
        if (title === "" || routineActivities.length === 0) {
          toast.info("Please enter a valid title and content");
          return;
        }

        let base64Url = "";
        setLoading(true);

        if (image || video || document) {
          base64Url = await convertToBase64(image || video || document);
        }

        const aiFiltration = await classifyRoutines(routineActivities, filters);
        const cleanResponse = aiFiltration?.replace(/```json|```/g, "");
        const jsonData: any = JSON.parse(cleanResponse);
        console.log("JSON data: ", jsonData.filters);

        // Move this declaration to the start of the routine block
        const formattedRoutineActivities = routineActivities.map(
          (activity: any) => ({
            id: activity.id,
            time: convertTo12Hour(activity.time),
            activity: activity.activity,
          })
        );

        const data = {
          title,
          description: "",
          media: {
            image: [],
            video: [],
            document: [],
          },
          category: [...(jsonData.filters || []), "routine"], // Safer array handling
          successStory: false,
          ownerType: "Expert",
          tags: [],
          verified: null,
          routine: formattedRoutineActivities, // Use the newly declared variable
        };

        console.log("Data : ", data);
        const response = await axios.post(
          "http://localhost:3000/api/post",
          data,
          { withCredentials: true }
        );
        console.log("Reponse from express : ", response);
        toast.success("Post created successfully");
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to create post");
    }
    // Call the external API for content verification
  };

  return (

    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
    <Navbar userType="expert" />

    <main className="flex-1 w-full container max-w-screen-lg px-4 sm:px-6 lg:px-8 py-12 mx-auto">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Create New Post
            </CardTitle>
            <CardDescription className="text-center">
              Share your knowledge and expertise with the community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Post Type</Label>
              <Select
                value={postType}
                onValueChange={(value: any) =>
                  setPostType(value as "general" | "routine")
                }
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select post type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Post</SelectItem>
                  <SelectItem value="routine">Routine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white focus-visible:ring-green-500"
              />
            </div>

            {postType === "general" ? (
              <>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="min-h-[200px] bg-white focus-visible:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Button asChild>
                    <label>
                      <ImageIcon className="mr-2 h-4 w-4" /> Add Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                      />
                    </label>
                  </Button>
                  <Button asChild>
                    <label>
                      <Video className="mr-2 h-4 w-4" /> Add Video
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => setVideo(e.target.files?.[0] || null)}
                      />
                    </label>
                  </Button>
                  <Button asChild>
                    <label>
                      <FileText className="mr-2 h-4 w-4" /> Add Document
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        className="hidden"
                        onChange={(e) =>
                          setDocument(e.target.files?.[0] || null)
                        }
                      />
                    </label>
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {routineActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    className="flex items-start space-x-4 relative p-4 border rounded-lg bg-white hover:shadow-md transition-shadow group"
                  >
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Time</Label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              type="time"
                              value={activity.time}
                              onChange={(e) => {
                                const newActivities = [...routineActivities];
                                newActivities[index].time = e.target.value;
                                setRoutineActivities(newActivities);
                              }}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Activity</Label>
                          <Input
                            value={activity.activity}
                            onChange={(e) => {
                              const newActivities = [...routineActivities];
                              newActivities[index].activity = e.target.value;
                              setRoutineActivities(newActivities);
                            }}
                            placeholder="Describe the activity"
                          />
                        </div>
                      </div>
                    </div>
                    {routineActivities.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                        onClick={() => removeActivity(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full hover:bg-green-50 hover:text-green-700"
                  onClick={addActivity}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Activity
                </Button>
              </div>
            )}

            <Button2
              type="button"
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleSubmit}
            >
              Publish Post
            </Button2>
          </CardContent>
        </Card>
      </main>

      <Footer userType="expert" />
    </div>
  );
}
