// src/pages/SuccessStoriesPage.tsx
import { useState } from "react";
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
} from "@mui/material";
import { Add, Share, Close, Verified } from "@mui/icons-material";
import { Filter } from "@/components/Filter/Filter";
import { SuccessStoryCard } from "@/components/PostCards/SuccessStoryCard/SuccessStoryCard";
import { PostCardSkeleton } from "@/components/PostCards/PostCardSkeleton";
import { motion } from "framer-motion";
// import { useFormik } from "formik";
// import * as yup from 'yup';
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import MuiListItemText from "@mui/material/ListItemText";

interface Author {
  id: string;
  name: string;
  avatar: string;
}

interface Doctor {
  id: string;
  name: string;
  avatar: string;
  credentials: string;
}

interface Comment {
  id: string;
  author: Author;
  text: string;
  createdAt: Date;
  likes: number; // Added likes property
  replies?: Comment[];
}

export interface SuccessStoryType {
  id: string;
  author: Author;
  title: string;
  content: string;
  images?: string[];
  video?: string;
  document?: string;
  likes: number;
  likedBy: string[];
  comments: number;
  commentsList?: Comment[];
  readTime: string;
  tags: string[];
  verification: {
    verified: boolean;
    verifiedBy: Doctor[];
  };
  createdAt: Date;
}

// const validationSchema = yup.object({
//   title: yup.string().required('Title is required').max(100, 'Title too long'),
//   content: yup.string().required('Content is required').max(2000, 'Content too long'),
//   tags: yup.string(),
// });

export function AllSuccessStoriesPosts() {
  const [userType] = useState<"expert" | "patient">("patient");
  const [userId] = useState("user-2");
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [isLoading] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentPost, setCurrentPost] = useState<SuccessStoryType | null>(null);
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [openVerifiersDialog, setOpenVerifiersDialog] = useState(false);
  const [currentVerifiers, setCurrentVerifiers] = useState<Doctor[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  // Dummy data for success stories
  const [successStories, setSuccessStories] = useState<SuccessStoryType[]>([
    {
      id: "story-1",
      author: {
        id: "user-1",
        name: "Rakesh",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
      title: "How Ayurveda Helped My Cow Recover from Digestive Issues",
      content:
        "My cow was suffering from severe digestive problems for weeks. After trying various treatments, I turned to Ayurvedic remedies. The combination of buttermilk with rock salt and neem leaf decoction worked wonders. Within two weeks, her digestion improved significantly.",
      images: [
        "https://images.unsplash.com/photo-1601758003122-53c40e686a19",
        "https://images.unsplash.com/photo-1603048719539-04d7f370038e",
      ],
      likes: 56,
      likedBy: ["user-2", "user-5"],
      comments: 8,
      commentsList: [
        {
          id: "comment-1",
          author: {
            id: "user-2",
            name: "Dr. Sharma",
            avatar: "https://i.pravatar.cc/150?img=11",
          },
          text: "This is a great example of how traditional remedies can complement modern veterinary care.",
          createdAt: new Date("2023-05-15T10:30:00"),
          likes: 5,
          replies: [],
        },
      ],
      readTime: "4 min read",
      tags: ["Ayurveda", "Cow Care", "Digestive Health"],
      verification: {
        verified: true,
        verifiedBy: [
          {
            id: "doc-1",
            name: "Dr. Shakti Sharma",
            avatar: "https://i.pravatar.cc/150?img=11",
            credentials: "Ayurvedic Doctor",
          },
          {
            id: "doc-2",
            name: "Dr. Aditya Rao",
            avatar: "https://i.pravatar.cc/150?img=13",
            credentials: "Ayurvedic Specialist",
          },
        ],
      },
      createdAt: new Date("2023-05-10T09:00:00"),
    },
    {
      id: "story-2",
      author: {
        id: "user-4",
        name: "Priya",
        avatar: "https://i.pravatar.cc/150?img=8",
      },
      title: "Natural Deworming Treatment for My Cattle",
      content:
        "After noticing signs of parasites in my cattle, I used a combination of ajwain (carom seeds) with warm water as suggested by my grandfather. The results were remarkable - within days, the symptoms reduced significantly. This traditional remedy saved me expensive vet bills.",
      images: ["https://images.unsplash.com/photo-1601758003122-53c40e686a20"],
      likes: 34,
      likedBy: ["user-1"],
      comments: 5,
      readTime: "3 min read",
      tags: ["Deworming", "Natural Remedies"],
      verification: {
        verified: true,
        verifiedBy: [
          {
            id: "doc-1",
            name: "Dr. Shakti Sharma",
            avatar: "https://i.pravatar.cc/150?img=11",
            credentials: "Ayurvedic Doctor",
          },
        ],
      },
      createdAt: new Date("2023-05-12T14:00:00"),
    },
    {
      id: "story-3",
      author: {
        id: "user-5",
        name: "Vijay",
        avatar: "https://i.pravatar.cc/150?img=9",
      },
      title: "Recovering from Mastitis with Herbal Compresses",
      content:
        "When one of my dairy cows developed mastitis, I used warm herbal compresses with turmeric and neem. The inflammation reduced within days, and the cow was back to normal milk production in a week. I'm sharing this to help other farmers facing similar issues.",
      likes: 22,
      likedBy: [],
      comments: 3,
      readTime: "5 min read",
      tags: ["Mastitis", "Herbal Treatment"],
      verification: {
        verified: false,
        verifiedBy: [],
      },
      createdAt: new Date("2023-05-15T16:00:00"),
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
  //       const updatedPosts = successStories.map(post => {
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
  //       setSuccessStories(updatedPosts);
  //       setOpenEditDialog(false);
  //       showSnackbar('Post updated successfully!', 'success');
  //     }
  //   },
  // });

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
    setSuccessStories((prevPosts) =>
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

    setSuccessStories((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: `comment-${Date.now()}`,
            author: {
              id: userId,
              name: userId === "user-2" ? "Dr. Sharma" : "Current User",
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

  const handleShare = (post: SuccessStoryType) => {
    navigator.clipboard.writeText(
      `Check out this success story: ${post.title}\n\n${post.content.substring(
        0,
        100
      )}...`
    );
    showSnackbar("Post link copied to clipboard!", "info");
  };

  const handleAddReply = (postId: string, commentId: string, reply: string) => {
    if (!reply.trim()) return;

    setSuccessStories((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const updatedCommentsList =
            post.commentsList?.map((comment) => {
              if (comment.id === commentId) {
                const newReply = {
                  id: `reply-${Date.now()}`,
                  author: {
                    id: userId,
                    name: userId === "user-2" ? "Dr. Sharma" : "Current User",
                    avatar: "https://i.pravatar.cc/150?img=15",
                  },
                  text: reply,
                  createdAt: new Date(),
                  likes: 0,
                  replies: [],
                };
                return {
                  ...comment,
                  replies: [...(comment.replies || []), newReply],
                };
              }
              return comment;
            }) || [];

          return {
            ...post,
            commentsList: updatedCommentsList,
          };
        }
        return post;
      })
    );
    showSnackbar("Reply added!", "success");
  };

  const openMediaViewer = (mediaUrl: string) => {
    setSelectedMedia(mediaUrl);
    setOpenMediaDialog(true);
  };

  const openVerifiersViewer = (verifiers: Doctor[]) => {
    setCurrentVerifiers(verifiers);
    setOpenVerifiersDialog(true);
  };

  const handleEdit = () => {
    // Add logic for editing a post
  };

  const handleDelete = () => {
    // Add logic for deleting a post
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
                Success Stories
              </Typography>
              <Typography variant="subtitle1" className="text-gray-600 mt-2">
                Real people, real results with Ayurveda
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
                <span className="sm:hidden">Create</span>
              </Button>
            </Box>
          </Box>

          <Box className="mt-6 space-y-6">
            {isLoading
              ? Array(3)
                  .fill(0)
                  .map((_, index) => <PostCardSkeleton key={index} />)
              : successStories.map((post) => (
                  <SuccessStoryCard
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
                    onMediaClick={() =>
                      openMediaViewer(post.video || post.images?.[0] || "")
                    }
                    menuItems={[
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
        <DialogTitle>Edit Post</DialogTitle>
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
            // onClick={() => formik.handleSubmit()}
            color="primary"
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Media Viewer Dialog */}
      <Dialog
        open={openMediaDialog}
        onClose={() => setOpenMediaDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Media</Typography>
            <IconButton onClick={() => setOpenMediaDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedMedia &&
            (selectedMedia.includes("youtube") ? (
              <iframe
                width="100%"
                height="500"
                src={selectedMedia}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <img
                className="success-story-image"
                src={selectedMedia}
                alt="Post media"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
            ))}
        </DialogContent>
      </Dialog>

      {/* Verifiers Dialog */}
      <Dialog
        open={openVerifiersDialog}
        onClose={() => setOpenVerifiersDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Verified By</Typography>
            <IconButton onClick={() => setOpenVerifiersDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <List>
            {currentVerifiers.map((doctor, index) => (
              <ListItem
                key={doctor.id}
                divider={index !== currentVerifiers.length - 1}
              >
                <ListItemAvatar>
                  <Avatar src={doctor.avatar} alt={doctor.name}>
                    {doctor.name[0]}
                  </Avatar>
                </ListItemAvatar>
                <MuiListItemText
                  primary={doctor.name}
                  secondary={doctor.credentials}
                />
                <Verified color="primary" />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVerifiersDialog(false)} color="primary">
            Close
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
