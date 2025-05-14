import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button, Typography, Box, Container, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from "@mui/material";
import { Add, MoreVert, Share, Close, Edit, Delete } from "@mui/icons-material";
import { Filter } from "@/components/Filter/Filter";
import { GeneralPostCard } from "@/components/PostCards/GeneralPostCard";
import { PostCardSkeleton } from "@/components/PostCards/PostCardSkeleton";
import { motion } from "framer-motion";
// import { useFormik } from "formik";
// import * as yup from 'yup';

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

export function AllGeneralPosts() {
  const [userType] = useState<"expert" | "patient">("patient");
  const [userId] = useState("user-2"); // Simulated current user ID
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [isLoading] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentPost, setCurrentPost] = useState<GeneralPostsType | null>(null);
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Embedded post data
  const [generalPosts, setGeneralPosts] = useState<GeneralPostsType[]>([
    {
      id: "post-1",
      author: {
        id: "user-1",
        name: "Dr. Sharma",
        avatar: "https://i.pravatar.cc/150?img=11"
      },
      title: "The Power of Turmeric in Ayurveda",
      content: "Turmeric (Curcuma longa) has been used in Ayurveda for centuries as both a culinary spice and medicinal herb. Its active compound curcumin has powerful anti-inflammatory effects and is a very strong antioxidant.\n\nIn Ayurvedic medicine, turmeric is considered a balancing herb that helps with digestion, supports joint health, and promotes radiant skin. It's often used in golden milk recipes for its healing properties.",
      images: [
        "https://images.unsplash.com/photo-1603048719539-04d7f370038e",
        "https://images.unsplash.com/photo-1603569283847-aa295f0d016a",
        "https://images.unsplash.com/photo-1603569283847-aa295f0d016b",
        "https://images.unsplash.com/photo-1603569283847-aa295f0d016c",
      ],
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      document: "https://example.com/ayurvedic-remedies.pdf",
      likes: 42,
      likedBy: ["user-2", "user-5"],
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
    {
      id: "post-2",
      author: {
        id: "user-4",
        name: "Dr. Gupta",
        avatar: "https://i.pravatar.cc/150?img=14"
      },
      title: "Understanding Doshas: Vata, Pitta, Kapha",
      content: "The three doshas—Vata (air & space), Pitta (fire & water), and Kapha (water & earth)—are the foundational concepts of Ayurveda. Each person has a unique balance of these doshas that determines their physical, mental, and emotional characteristics.\n\nWhen the doshas are balanced, we experience health. When they're imbalanced, we experience disease. Ayurvedic treatments aim to restore balance through diet, herbs, and lifestyle changes.",
      images: [
        "https://images.unsplash.com/photo-1603048719539-04d7f370038f",
      ],
      likes: 28,
      likedBy: ["user-1"],
      comments: 5,
      readTime: "5 min read",
      tags: ["Doshas", "Ayurveda Basics"],
      createdAt: new Date("2023-05-12T14:00:00")
    }
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
  //       const updatedPosts = generalPosts.map(post => {
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
  //       setGeneralPosts(updatedPosts);
  //       setOpenEditDialog(false);
  //       showSnackbar('Post updated successfully!', 'success');
  //     }
  //   },
  // });

  useEffect(() => {
    if (currentPost) {
      formik.setValues({
        title: currentPost.title,
        content: currentPost.content,
        tags: currentPost.tags.join(', ')
      });
    }
  }, [currentPost]);

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const toggleLike = (postId: string) => {
    setGeneralPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const isLiked = post.likedBy.includes(userId);
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            likedBy: isLiked 
              ? post.likedBy.filter(id => id !== userId) 
              : [...post.likedBy, userId]
          };
        }
        return post;
      })
    );
  };

  const toggleSave = (postId: string) => {
    setSavedPosts(prev => {
      const newSaved = new Set(prev);
      newSaved.has(postId) ? newSaved.delete(postId) : newSaved.add(postId);
      return newSaved;
    });
  };

  const handleAddComment = (postId: string, commentText: string) => {
    if (!commentText.trim()) return;
    
    setGeneralPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const newComment = {
            id: `comment-${Date.now()}`,
            author: {
              id: userId,
              name: userId === "user-2" ? "Vaidya Patel" : "Current User",
              avatar: "https://i.pravatar.cc/150?img=15"
            },
            text: commentText,
            createdAt: new Date(),
            replies: []
          };
          
          return {
            ...post,
            comments: post.comments + 1,
            commentsList: [...(post.commentsList || []), newComment]
          };
        }
        return post;
      })
    );
    showSnackbar('Comment added!', 'success');
  };

  const handleAddReply = (postId: string, commentId: string, replyText: string) => {
    if (!replyText.trim()) return;
    
    setGeneralPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const updatedComments = post.commentsList?.map(comment => {
            if (comment.id === commentId) {
              const newReply = {
                id: `reply-${Date.now()}`,
                author: {
                  id: userId,
                  name: userId === "user-2" ? "Vaidya Patel" : "Current User",
                  avatar: "https://i.pravatar.cc/150?img=15"
                },
                text: replyText,
                createdAt: new Date()
              };
              
              return {
                ...comment,
                replies: [...(comment.replies || []), newReply]
              };
            }
            return comment;
          });
          
          return {
            ...post,
            comments: post.comments + 1,
            commentsList: updatedComments
          };
        }
        return post;
      })
    );
    showSnackbar('Reply added!', 'success');
  };

  const handleShare = (post: GeneralPostsType) => {
    // In a real app, this would use the Web Share API or open a share dialog
    navigator.clipboard.writeText(`Check out this post: ${post.title}\n\n${post.content.substring(0, 100)}...`);
    showSnackbar('Post link copied to clipboard!', 'info');
  };

  const handleEdit = (post: GeneralPostsType) => {
    setCurrentPost(post);
    setOpenEditDialog(true);
  };

  const handleDelete = (postId: string) => {
    setGeneralPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    showSnackbar('Post deleted!', 'success');
  };

  const openMediaViewer = (media: string) => {
    setSelectedMedia(media);
    setOpenMediaDialog(true);
  };

  const isPostAuthor = (post: GeneralPostsType) => {
    return post.author.id === userId;
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
                <span className="sm:hidden">Create</span>
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
                    isLiked={post.likedBy.includes(userId)}
                    isSaved={savedPosts.has(post.id)}
                    currentUserId={userId}
                    onLike={() => toggleLike(post.id)}
                    onSave={() => toggleSave(post.id)}
                    onShare={() => handleShare(post)}
                    onComment={(comment) => handleAddComment(post.id, comment)}
                    onReply={(commentId, reply) => handleAddReply(post.id, commentId, reply)}
                    onMediaClick={openMediaViewer}
                    menuItems={[
                      ...(isPostAuthor(post) ? [
                        { 
                          label: 'Edit', 
                          icon: <Edit fontSize="small" />,
                          action: () => handleEdit(post) 
                        },
                        { 
                          label: 'Delete', 
                          icon: <Delete fontSize="small" />,
                          action: () => handleDelete(post.id) 
                        }
                      ] : []),
                      { 
                        label: 'Share', 
                        icon: <Share fontSize="small" />,
                        action: () => handleShare(post) 
                      }
                    ]}
                  />
                ))}
          </Box>
        </motion.div>
      </Container>
      <Footer userType={userType} />

      {/* Edit Post Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth maxWidth="md">
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
      {/* <Dialog 
        open={openMediaDialog} 
        onClose={() => setOpenMediaDialog(false)} 
        fullWidth 
        maxWidth="md"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Media</Typography>
            <IconButton onClick={() => setOpenMediaDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedMedia && (
            selectedMedia.includes('youtube') ? (
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
                src={selectedMedia} 
                alt="Post media" 
                style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain' }}
              />
            )
          )}
        </DialogContent>
      </Dialog> */}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}