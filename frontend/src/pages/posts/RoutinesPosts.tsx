import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  Button,
  Typography,
  Box,
  Container,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import { Add, MoreVert, Share, Close, Edit, Delete } from "@mui/icons-material";
import { Filter } from "@/components/Filter/Filter";
import { RoutinePostCard } from "@/components/PostCards/RoutinePostCard/RoutinePostCard";
import { PostCardSkeleton } from "@/components/PostCards/PostCardSkeleton";
import { motion } from "framer-motion";
// import { useFormik } from "formik";
// import * as yup from 'yup';

interface Author {
  id: string;
  name: string;
  avatar: string;
}

interface Activity {
  time: string;
  content: string;
}

interface Comment {
  id: string;
  author: Author;
  text: string;
  createdAt: Date;
  likes: number;
  replies?: Comment[];
}

export interface RoutinePostType {
  id: string;
  author: Author;
  title: string;
  content: string;
  thumbnail: string;
  activities: Activity[];
  likes: number;
  likedBy: string[];
  comments: number;
  commentsList?: Comment[];
  readTime: string;
  tags: string[];
  createdAt: Date;
}

// const validationSchema = yup.object({
//   title: yup.string().required('Title is required').max(100, 'Title too long'),
//   content: yup.string().required('Content is required').max(2000, 'Content too long'),
//   tags: yup.string(),
// });

export function AllRoutinePosts() {
  const [userType] = useState<"expert" | "patient">("patient");
  const [userId] = useState("user-2");
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentPost, setCurrentPost] = useState<RoutinePostType | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  // Dummy data for fallback or testing
  const [routinePosts, setRoutinePosts] = useState<RoutinePostType[]>([
    {
      id: "routine-1",
      author: {
        id: "user-1",
        name: "Dr. Sharma",
        avatar: "https://i.pravatar.cc/150?img=11",
      },
      title: "Morning Ayurvedic Routine for Balance",
      content:
        "This daily routine helps balance all three doshas and sets you up for a productive, healthy day. Follow these steps within 30 minutes of waking for maximum benefits.",
      thumbnail: "https://images.unsplash.com/photo-1545205597-3d9d02c29597",
      activities: [
        {
          time: "5:30 AM",
          content: "Wake up: Rise before sunrise for optimal energy",
        },
        {
          time: "5:45 AM",
          content: "Oil pulling: Swish 1 tbsp coconut oil for 5-10 minutes",
        },
        {
          time: "6:00 AM",
          content: "Warm lemon water: Drink a glass to stimulate digestion",
        },
        {
          time: "6:15 AM",
          content:
            "Yoga & Pranayama: 20 minutes of sun salutations and breathing exercises",
        },
        {
          time: "6:45 AM",
          content: "Meditation: 15 minutes of mindfulness practice",
        },
        {
          time: "7:00 AM",
          content: "Ayurvedic breakfast: Khichdi or stewed apples with spices",
        },
      ],
      likes: 56,
      likedBy: ["user-2", "user-4"],
      comments: 8,
      commentsList: [
        {
          id: "comment-1",
          author: {
            id: "user-2",
            name: "Vaidya Patel",
            avatar: "https://i.pravatar.cc/150?img=12",
          },
          text: "Excellent routine! I would suggest adding abhyanga (self-massage) before shower for Vata types.",
          createdAt: new Date("2023-05-18T08:30:00"),
          likes: 3,
          replies: [
            {
              id: "reply-1",
              author: {
                id: "user-3",
                name: "Ayush Kumar",
                avatar: "https://i.pravatar.cc/150?img=13",
              },
              text: "Yes! Using warm sesame oil works wonders for grounding Vata.",
              createdAt: new Date("2023-05-18T09:15:00"),
              likes: 1,
            },
          ],
        },
      ],
      readTime: "4 min read",
      tags: ["Morning Routine", "Dosha Balance", "Daily Practice"],
      createdAt: new Date("2023-05-15T07:00:00"),
    },
    {
      id: "routine-2",
      author: {
        id: "user-4",
        name: "Dr. Gupta",
        avatar: "https://i.pravatar.cc/150?img=14",
      },
      title: "Pitta-Pacifying Evening Routine",
      content:
        "This cooling evening routine helps calm Pitta dosha after a long day. Perfect for hot summer months or when feeling irritable/overheated.",
      thumbnail: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5",
      activities: [
        {
          time: "6:00 PM",
          content: "Cooling foot bath with rose petals",
        },
        {
          time: "6:30 PM",
          content: "Gentle yoga (moon salutations)",
        },
        {
          time: "7:00 PM",
          content: "Light dinner: Cooling foods like cucumber, coconut, mint",
        },
        {
          time: "8:00 PM",
          content: "Moon gazing meditation",
        },
        {
          time: "8:30 PM",
          content: "Cooling herbal tea (chrysanthemum or rose)",
        },
        {
          time: "9:30 PM",
          content: "Bedtime with cooling aromatherapy (sandalwood or jasmine)",
        },
      ],
      likes: 34,
      likedBy: ["user-1"],
      comments: 5,
      commentsList: [
        {
          id: "comment-2",
          author: {
            id: "user-5",
            name: "Priya Desai",
            avatar: "https://i.pravatar.cc/150?img=15",
          },
          text: "This routine saved me during heat waves! Adding aloe vera gel to the foot bath enhances the cooling effect.",
          createdAt: new Date("2023-05-20T19:45:00"),
          likes: 2,
        },
      ],
      readTime: "3 min read",
      tags: ["Pitta", "Evening Routine", "Cooling"],
      createdAt: new Date("2023-05-18T14:00:00"),
    },
    {
      id: "routine-3",
      author: {
        id: "user-6",
        name: "Dr. Kapoor",
        avatar: "https://i.pravatar.cc/150?img=16",
      },
      title: "Kapha-Invigorating Winter Routine",
      content:
        "This energizing routine helps combat winter lethargy and keeps Kapha dosha in balance during cold, damp months.",
      thumbnail: "https://images.unsplash.com/photo-1511882150382-421056883f65",
      activities: [
        {
          time: "6:00 AM",
          content: "Dry brushing before shower",
        },
        {
          time: "6:30 AM",
          content: "Vigorous yoga (5 rounds of sun salutations)",
        },
        {
          time: "7:00 AM",
          content: "Warm ginger tea with honey",
        },
        {
          time: "7:30 AM",
          content: "Spicy breakfast (upma with ginger and black pepper)",
        },
        {
          time: "12:00 PM",
          content: "Brisk walk after lunch",
        },
        {
          time: "6:00 PM",
          content: "Steam inhalation with eucalyptus oil",
        },
      ],
      likes: 42,
      likedBy: ["user-2", "user-7"],
      comments: 6,
      readTime: "5 min read",
      tags: ["Kapha", "Winter", "Energizing"],
      createdAt: new Date("2023-05-20T09:30:00"),
    },
  ]);

  // const formik = useFormik({
  //   initialValues: {
  //     title: '',
  //     content: '',
  //     tags: ''
  //   },
  //   validationSchema: validationSchema,
  //   onSubmit: (values) => {
  //     if (currentPost) {
  //       const updatedPosts = routinePosts.map(post => {
  //         if (post.id === currentPost.id) {
  //           return {
  //             ...post,
  //             title: values.title,
  //             content: values.content,
  //             tags: values.tags.split(',').map(tag => tag.trim())
  //           };
  //         }
  //         return post;
  //       });
  //       setRoutinePosts(updatedPosts);
  //       setOpenEditDialog(false);
  //       showSnackbar('Routine updated successfully!', 'success');
  //     }
  //   },
  // });

  useEffect(() => {
    async function getRoutinePosts() {
      try {
        setIsLoading(true);
        // In a real app, you would fetch from your API here
        // const response = await get(`${import.meta.env.VITE_SERVER_URL}/api/routines`);
        // setRoutinePosts(response?.routines || routinePosts);
      } catch (error) {
        console.error("Error fetching routines:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getRoutinePosts();
  }, []);

  useEffect(() => {
    // if (currentPost) {
    //   formik.setValues({
    //     title: currentPost.title,
    //     content: currentPost.content,
    //     tags: currentPost.tags.join(', ')
    //   });
    // }
  }, [currentPost]);

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const toggleLike = (postId: string) => {
    setRoutinePosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isLiked = post.likedBy.includes(userId);
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            likedBy: isLiked
              ? post.likedBy.filter((id) => id !== userId)
              : [...post.likedBy, userId],
          };
        }
        return post;
      })
    );
  };

  const toggleSave = (postId: string) => {
    setSavedPosts((prev) => {
      const newSaved = new Set(prev);
      newSaved.has(postId) ? newSaved.delete(postId) : newSaved.add(postId);
      return newSaved;
    });
  };

  const handleAddComment = (postId: string, commentText: string) => {
    if (!commentText.trim()) return;

    setRoutinePosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: `comment-${Date.now()}`,
            author: {
              id: userId,
              name: userId === "user-2" ? "Vaidya Patel" : "Current User",
              avatar: "https://i.pravatar.cc/150?img=15",
            },
            text: commentText,
            createdAt: new Date(),
            likes: 0,
            replies: [],
          };

          return {
            ...post,
            comments: post.comments + 1,
            commentsList: [...(post.commentsList || []), newComment],
          };
        }
        return post;
      })
    );
    showSnackbar("Comment added!", "success");
  };

  const handleAddReply = (
    postId: string,
    commentId: string,
    replyText: string
  ) => {
    if (!replyText.trim()) return;

    setRoutinePosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const updatedComments = post.commentsList?.map((comment) => {
            if (comment.id === commentId) {
              const newReply = {
                id: `reply-${Date.now()}`,
                author: {
                  id: userId,
                  name: userId === "user-2" ? "Vaidya Patel" : "Current User",
                  avatar: "https://i.pravatar.cc/150?img=15",
                },
                text: replyText,
                createdAt: new Date(),
                likes: 0,
              };

              return {
                ...comment,
                replies: [...(comment.replies || []), newReply],
              };
            }
            return comment;
          });

          return {
            ...post,
            comments: post.comments + 1,
            commentsList: updatedComments,
          };
        }
        return post;
      })
    );
    showSnackbar("Reply added!", "success");
  };

  const handleShare = (post: RoutinePostType) => {
    navigator.clipboard.writeText(
      `Check out this routine: ${post.title}\n\n${post.content.substring(
        0,
        100
      )}...`
    );
    showSnackbar("Routine link copied to clipboard!", "info");
  };

  const handleEdit = (post: RoutinePostType) => {
    setCurrentPost(post);
    setOpenEditDialog(true);
  };

  const handleDelete = (postId: string) => {
    setRoutinePosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== postId)
    );
    showSnackbar("Routine deleted!", "success");
  };

  const isPostAuthor = (post: RoutinePostType) => {
    // return post.author.id === userId;
    return true;
  };

  return (
    <Box className="w-screen bg-gray-50 flex flex-col">
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
                Ayurvedic Routines
              </Typography>
              <Typography variant="subtitle1" className="text-gray-600 mt-2">
                Discover daily routines for optimal health
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
                <span className="hidden sm:inline">Create Routine</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </Box>
          </Box>

          <Box className="mt-6 space-y-6">
            {isLoading
              ? Array(3)
                  .fill(0)
                  .map((_, index) => <PostCardSkeleton key={index} />)
              : routinePosts.map((post) => (
                  <RoutinePostCard
                    key={post.id}
                    post={post}
                    isLiked={post.likedBy.includes(userId)}
                    isSaved={savedPosts.has(post.id)}
                    currentUserId={userId}
                    onLike={() => toggleLike(post.id)}
                    onSave={() => toggleSave(post.id)}
                    onShare={() => handleShare(post)}
                    onComment={(comment) => handleAddComment(post.id, comment)}
                    onReply={(commentId, reply) =>
                      handleAddReply(post.id, commentId, reply)
                    }
                    onMediaClick={(media) => {
                      /* handle media click if needed */
                    }}
                    menuItems={[
                      ...(isPostAuthor(post)
                        ? [
                            {
                              label: "Edit",
                              icon: <Edit fontSize="small" />,
                              action: () => handleEdit(post),
                            },
                            {
                              label: "Delete",
                              icon: <Delete fontSize="small" />,
                              action: () => handleDelete(post.id),
                            },
                          ]
                        : []),
                      {
                        label: "Share",
                        icon: <Share fontSize="small" />,
                        action: () => handleShare(post),
                      },
                    ]}
                  />
                ))}
          </Box>
        </motion.div>
      </Container>
      <Footer userType={userType} />

      {/* Edit Post Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Edit Routine</DialogTitle>
        <DialogContent dividers>
          <form
          // onSubmit={formik.handleSubmit}
          >
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Title"
              // value={formik.values.title}
              // onChange={formik.handleChange}
              // error={formik.touched.title && Boolean(formik.errors.title)}
              // helperText={formik.touched.title && formik.errors.title}
              margin="normal"
            />
            <TextField
              fullWidth
              id="content"
              name="content"
              label="Content"
              multiline
              rows={6}
              // value={formik.values.content}
              // onChange={formik.handleChange}
              // error={formik.touched.content && Boolean(formik.errors.content)}
              // helperText={formik.touched.content && formik.errors.content}
              margin="normal"
            />
            <TextField
              fullWidth
              id="tags"
              name="tags"
              label="Tags (comma separated)"
              // value={formik.values.tags}
              // onChange={formik.handleChange}
              // error={formik.touched.tags && Boolean(formik.errors.tags)}
              // helperText={formik.touched.tags && formik.errors.tags}
              margin="normal"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button
            // onClick={() =>
            //   // formik.handleSubmit()
            // }
            color="primary"
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
