import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button, Typography, Box, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { Filter } from "@/components/Filter/Filter";
import { GeneralPostCard } from "@/components/PostCards/GeneralPostCard";
import { PostCardSkeleton } from "@/components/PostCards/PostCardSkeleton";
import { motion } from "framer-motion";

interface Author {
  id: string;
  name: string;
  avatar: string;
}

interface Comment {
  id: string;
  author: Author;
  text: string;
  createdAt: Date;
  replies?: Comment[];
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
  commentsList?: Comment[];
  readTime: string;
  tags: string[];
  createdAt: Date;
}

export function AllGeneralPosts() {
  const [userType] = useState<"expert" | "patient">("patient");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [isLoading] = useState(false);

  // Embedded post data
  const [generalPosts] = useState<GeneralPostsType[]>([
    {
      id: "post-1",
      author: {
        id: "user-1",
        name: "Dr. Sharma",
        avatar: "https://i.pravatar.cc/150?img=11"
      },
      title: "The Power of Turmeric in Ayurveda",
      content: "Turmeric (Curcuma longa) has been used in Ayurveda for centuries as both a culinary spice and medicinal herb...",
      images: [
        "https://images.unsplash.com/photo-1603048719539-04d7f370038e",
        "https://images.unsplash.com/photo-1603569283847-aa295f0d016a",
      ],
      likes: 42,
      comments: 3,
      commentsList: [
        {
          id: "comment-1",
          author: {
            id: "user-2",
            name: "Vaidya Patel",
            avatar: "https://i.pravatar.cc/150?img=12"
          },
          text: "Great explanation! I often recommend turmeric with black pepper to enhance absorption.",
          createdAt: new Date("2023-05-15T10:30:00"),
          replies: [
            {
              id: "reply-1",
              author: {
                id: "user-3",
                name: "Ayush Kumar",
                avatar: "https://i.pravatar.cc/150?img=13"
              },
              text: "Yes! The piperine in black pepper increases curcumin absorption by 2000%!",
              createdAt: new Date("2023-05-15T11:45:00")
            }
          ]
        }
      ],
      readTime: "3 min read",
      tags: ["Ayurveda", "Herbs", "Remedies"],
      createdAt: new Date("2023-05-10T09:00:00")
    },
    // ... other posts
  ]);

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newLiked = new Set(prev);
      newLiked.has(postId) ? newLiked.delete(postId) : newLiked.add(postId);
      return newLiked;
    });
  };

  const toggleSave = (postId: string) => {
    setSavedPosts((prev) => {
      const newSaved = new Set(prev);
      newSaved.has(postId) ? newSaved.delete(postId) : newSaved.add(postId);
      return newSaved;
    });
  };

  const handleAddComment = (postId: string, commentText: string) => {
    console.log(`Adding comment to post ${postId}: ${commentText}`);
  };

  const handleAddReply = (postId: string, commentId: string, replyText: string) => {
    console.log(`Adding reply to comment ${commentId} in post ${postId}: ${replyText}`);
  };

  return (
    <Box className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar userType={userType} />
      <Container maxWidth="xl" className="flex-1 py-12 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <Box>
              <Typography 
                variant="h3" 
                className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
              >
                General Ayurvedic Posts
              </Typography>
              <Typography variant="subtitle1" className="text-gray-600 mt-2">
                Discover knowledge and insights from Ayurvedic experts
              </Typography>
            </Box>
            <Box className="flex items-center gap-3">
              <Filter />
              <Button
                component={Link}
                to="/posts/create"
                variant="contained"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md text-white"
                startIcon={<Add />}
              >
                <span className="hidden sm:inline">Create Post</span>
              </Button>
            </Box>
          </Box>

          <Box className="mt-6 space-y-6">
            {isLoading
              ? Array(3).fill(0).map((_, index) => (
                  <PostCardSkeleton key={index} />
                ))
              : generalPosts.map((post) => (
                  <GeneralPostCard
                    key={post.id}
                    post={post}
                    liked={likedPosts.has(post.id)}
                    saved={savedPosts.has(post.id)}
                    onLike={() => toggleLike(post.id)}
                    onSave={() => toggleSave(post.id)}
                    onComment={(comment) => handleAddComment(post.id, comment)}
                    onReply={(commentId, reply) => handleAddReply(post.id, commentId, reply)}
                  />
                ))}
          </Box>
        </motion.div>
      </Container>
      <Footer userType={userType} />
    </Box>
  );
}