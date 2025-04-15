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
  X,
  Image as ImageIcon,
  Video,
  FileText,
  Trash2,
  Clock,
  Loader2,
  Loader,
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
import AddPostForm from "@/components/Forms/Expert/AddPostForm/AddPostForm";
import AddRoutineForm from "@/components/Forms/Expert/AddRoutineForm/AddRoutineForm";

const CreatePost = () => {
  const [postType, setPostType] = useState<"general" | "routine">("general");

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar userType="expert" />

      <main className="container mx-auto px-4 py-24">
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

            {postType === "general" ? (
              <>
                <AddPostForm />
              </>
            ) : (
              <AddRoutineForm />
            )}
          </CardContent>
        </Card>
      </main>

      <Footer userType="expert" />
    </div>
  );
};

export default CreatePost;
