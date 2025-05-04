// src/pages/RoutinePostsPage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Filter } from "@/components/Filter/Filter";
import { RoutinePostCard } from "@/components/PostCards/RoutinePostCard";
import { PostCardSkeleton } from "@/components/PostCards/PostCardSkeleton";
import { motion } from "framer-motion";
import useApi from "@/hooks/useApi/useApi";

interface Author {
  name: string;
  avatar: string;
  // credentials: string;
  // experience: string;
}

interface Activity {
  time: string;
  content: string;
}

export interface RoutinePostType {
  id: string;
  author: Author;
  title: string;
  content: string;
  thumbnail: string;
  activities: Activity[];
  likes: number;
  comments: number;
  readTime: string;
  tags: string[];
  createdAt: Date;
}

export function AllRoutinePosts() {
  const { get } = useApi<{
    message: string;
    success: boolean;
    routines: RoutinePostType[];
  }>();

  const [userType] = useState<"expert" | "patient">("patient");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const [routinePosts, setRoutinePosts] = useState<RoutinePostType[]>([]);

  useEffect(() => {
    async function getRoutinePosts() {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/routines`
      );
      setRoutinePosts(response.routines);
      setIsLoading(false);
    }
    getRoutinePosts();
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
                Ayurvedic Routines
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Discover daily routines for optimal health
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
              : routinePosts.map((routinePost) => (
                  <RoutinePostCard
                    key={routinePost.id}
                    post={routinePost}
                    liked={likedPosts.has(routinePost.id)}
                    saved={savedPosts.has(routinePost.id)}
                    onLike={() => toggleLike(routinePost.id)}
                    onSave={() => toggleSave(routinePost.id)}
                  />
                ))}
          </div>
        </motion.div>
      </main>
      <Footer userType={userType} />
    </div>
  );
}
