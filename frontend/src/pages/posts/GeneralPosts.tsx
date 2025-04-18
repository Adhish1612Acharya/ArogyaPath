// src/pages/GeneralPostsPage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Filter } from "@/components/Filter/Filter";
import { GeneralPostCard } from "@/components/PostCards/GeneralPostCard";
import { PostCardSkeleton } from "@/components/PostCards/PostCardSkeleton";
import { motion } from "framer-motion";
import useApi from "@/hooks/useApi/useApi";

interface Author {
  name: string;
  avatar: string;
}

export interface GeneralPostsType {
  id: string;
  author: Author;
  title: string;
  content: string;
  images?: string[];
  video?: string;
  document?: string;
  likes: number;
  comments: number;
  readTime: string;
  tags: string[];
  createdAt: Date;
}

export function AllGeneralPosts() {
  const { get } = useApi<{
    message: string;
    success: boolean;
    posts: GeneralPostsType[];
  }>();

  const [userType] = useState<"expert" | "patient">("patient");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [generalPosts, setGeneralPosts] = useState<GeneralPostsType[]>([]);

  useEffect(() => {
    async function getGeneratPosts() {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/posts`
      );
      setGeneralPosts(response.posts);
      setIsLoading(false);
    }
    getGeneratPosts();
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
                General Ayurvedic Posts
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Discover knowledge and insights from Ayurvedic experts
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
              : generalPosts.map((generalPost) => (
                  <GeneralPostCard
                    key={generalPost.id}
                    post={generalPost}
                    liked={likedPosts.has(generalPost.id)}
                    saved={savedPosts.has(generalPost.id)}
                    onLike={() => toggleLike(generalPost.id)}
                    onSave={() => toggleSave(generalPost.id)}
                  />
                ))}
          </div>
        </motion.div>
      </main>
      <Footer userType={userType} />
    </div>
  );
}
