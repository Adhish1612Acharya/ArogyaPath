// src/pages/SuccessStoriesPage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Filter } from "@/components/Filter/Filter";
import {
  SuccessStoryCard,
  SuccessStoryCardProps,
} from "@/components/PostCards/SuccessStoryCard";
import { PostCardSkeleton } from "@/components/PostCards/PostCardSkeleton";
import { motion } from "framer-motion";
import useApi from "@/hooks/useApi/useApi";

interface Author {
  name: string;
  avatar: string;
  // credentials?: string;
  // experience?: string;
}

interface Doctor {
  name: string;
  avatar: string;
  // credentials: string;
}

interface Verification {
  verified: boolean;
  verifiedBy: Doctor[];
}

export interface SuccessStoryType {
  id: string;
  author: Author;
  title: string;
  content: string;
  images: string[];
  video: string;
  document: string;
  likes: number;
  comments: number;
  readTime: string;
  tags: string[];
  verification: Verification;
  taggedDoctors: Doctor[];
  activities: {
    time: string;
    content: string;
  }[];
  createdAt: Date;
  verifyAuthorization: boolean;
  alreadyVerified: boolean;
}

export function AllSuccessStoriesPosts() {
  const { get } = useApi<{
    message: string;
    success: boolean;
    successStories: SuccessStoryType[];
  }>();
  const [userType] = useState<"expert" | "patient">("patient");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [successStories, setSuccessStories] = useState<SuccessStoryType[]>([]);

  useEffect(() => {
    async function getSuccessStories() {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/success-stories`
      );
      setSuccessStories(response.successStories);
      setIsLoading(false);
    }
    getSuccessStories();
  }, []);

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      return newLiked;
    });
  };

  const toggleSave = (postId: string) => {
    setSavedPosts((prev) => {
      const newSaved = new Set(prev);
      if (newSaved.has(postId)) {
        newSaved.delete(postId);
      } else {
        newSaved.add(postId);
      }
      return newSaved;
    });
  };

  return (
    <div className="min-h-screen w-screen bg-gray-50 flex flex-col">
      <Navbar userType={userType} />
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Success Stories
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Real people, real results with Ayurveda
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Filter />
              <Button
                asChild
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md !text-white"
              >
                <Link to="/posts/create" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Create Post</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {isLoading
              ? Array(3)
                  .fill(0)
                  .map((_, index) => <PostCardSkeleton key={index} />)
              : successStories.map((successStory, index) => (
                  <SuccessStoryCard
                    index={index}
                    setPost={setSuccessStories}
                    key={successStory.id}
                    post={successStory}
                    liked={likedPosts.has(successStory.id)}
                    saved={savedPosts.has(successStory.id)}
                    onLike={() => toggleLike(successStory.id)}
                    onSave={() => toggleSave(successStory.id)}
                  />
                ))}
          </div>
        </motion.div>
      </main>
      <Footer userType={userType} />
    </div>
  );
}
