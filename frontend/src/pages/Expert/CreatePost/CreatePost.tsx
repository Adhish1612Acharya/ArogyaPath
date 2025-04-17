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
import { Plus, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Label } from "@/components/ui/label";
import { Footer } from "@/components/layout/footer";
import AddPostForm from "@/components/Forms/Expert/AddPostForm/AddPostForm";
import AddRoutineForm from "@/components/Forms/Expert/AddRoutineForm/AddRoutineForm";

const CreatePost = () => {
  const [postType, setPostType] = useState<"general" | "routine">("general");

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-green-50 to-white">
      <Navbar userType="expert" />

      <main className="w-full px-4 py-12 sm:px-6 lg:px-8">
        {/* Full width container with max content width */}
        <div className="w-[70%] mx-auto">
          {/* Hero Section - spans full width */}
          <div className="w-full text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
              Share Your <span className="text-green-600">Wisdom</span>
            </h1>
            <p className="text-xl text-gray-600 mx-auto max-w-3xl">
              Contribute to our community by sharing your expertise and healing knowledge
            </p>
          </div>

          {/* Main Card - full width but content constrained */}
          <div className="w-full flex justify-center">
            <Card className="w-full bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-100">
              <CardHeader className="w-full py-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                <div className="w-full flex flex-col items-center">
                  <CardTitle className="text-3xl font-bold tracking-tight">
                    Create New Post
                  </CardTitle>
                  <CardDescription className="mt-2 text-green-100">
                    {postType === "general" 
                      ? "Share insights, articles, or media" 
                      : "Create a wellness routine"}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="w-full p-8">
                {/* Post Type Selector - full width */}
                <div className="w-full mb-8">
                  <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <Label className="text-lg font-medium text-gray-700">
                      What would you like to create?
                    </Label>
                    <div className="w-full sm:w-64">
                      <Select
                        value={postType}
                        onValueChange={(value: any) =>
                          setPostType(value as "general" | "routine")
                        }
                      >
                        <SelectTrigger className="w-full h-12 bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:border-green-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all">
                          <SelectValue placeholder="Select post type" />
                        </SelectTrigger>
                        <SelectContent className="border-0 shadow-lg rounded-lg">
                          <SelectItem 
                            value="general" 
                            className="hover:bg-green-50 focus:bg-green-50"
                          >
                            <div className="flex items-center gap-2">
                              <Plus className="w-4 h-4 text-green-600" />
                              General Post
                            </div>
                          </SelectItem>
                          <SelectItem 
                            value="routine" 
                            className="hover:bg-green-50 focus:bg-green-50"
                          >
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                              Wellness Routine
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Dynamic Form Section - full width */}
                <div className="w-full border-t border-gray-200 pt-8">
                  {postType === "general" ? (
                    <AddPostForm />
                  ) : (
                    <AddRoutineForm />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer userType="expert" />
    </div>
  );
};

export default CreatePost;