import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Typography,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { Filter } from "@/components/Filter/Filter";

import { PostCardSkeleton } from "@/components/PostCards/PostCardSkeleton";
import { motion } from "framer-motion";
import RoutinePostCard from "@/components/PostCards/RoutinePostCard/RoutinePostCard";
import { RoutinePostType } from "@/types/RoutinesPost.types";
import MediaViewerDialog from "@/components/MediaViewerDialog/MediaViewerDialog";
import useRoutines from "@/hooks/useRoutine/useRoutine";

export function AllRoutinePosts() {
  const { getAllRoutinesPost } = useRoutines();

  const [userId, setUserId] = useState("user-2");
  const [isLoading, setIsLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentPost, setCurrentPost] = useState<RoutinePostType | null>(null);

  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [selectedMediaImageIndex, setSelectedMediaImageIndex] = useState<
    number | null
  >(null);
  const [mediaDialogImages, setMediaDialogImages] = useState<string[]>([]);

  const [routinePosts, setRoutinePosts] = useState<RoutinePostType[]>([]);

  useEffect(() => {
    async function getRoutinePosts() {
      try {
        setIsLoading(true);
        // In a real app, you would fetch from your API here
        const response = await getAllRoutinesPost();
        setRoutinePosts(response?.routines || routinePosts);
        setUserId(response.userId);
      } catch (error) {
        console.error("Error fetching routines:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getRoutinePosts();
  }, []);

  const handleEdit = (post: RoutinePostType) => {
    setCurrentPost(post);
    setOpenEditDialog(true);
  };

  const handleDelete = (postId: string) => {
    setRoutinePosts((prevPosts) =>
      prevPosts.filter((post) => post._id !== postId)
    );
  };

  const openMediaViewer = (mediaIndex: number, images: string[]) => {
    setSelectedMediaImageIndex(mediaIndex);
    setMediaDialogImages(images);
    setOpenMediaDialog(true);
  };

  const closeMediaViewer = () => {
    setSelectedMediaImageIndex(null);
    setMediaDialogImages([]);
    setOpenMediaDialog(false);
  };

  const isPostAuthor = (post: RoutinePostType) => {
    return post.owner._id === userId;
  };

  const handleNextImage = () => {
    if (mediaDialogImages.length > 0) {
      setSelectedMediaImageIndex(
        (prev) => (prev ? prev + 1 : 0) % mediaDialogImages.length
      );
    }
  };

  const handlePrevImage = () => {
    if (mediaDialogImages.length > 0) {
      setSelectedMediaImageIndex(
        (prev) =>
          (prev ? prev - 1 + mediaDialogImages.length : 0) %
          mediaDialogImages.length
      );
    }
  };

  const applyFilters = async (filters: string) => {
    try {
      setIsLoading(true);
      const response = await filterSearch(filters);
      setGeneralPosts(response.posts);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Filter failed:", error.message);
      if (error.status === 401) navigate("/auth");
    }
  };

  return (
    <Box className="w-screen bg-gray-50 flex flex-col">
      {/* <Navbar userType={userType} /> */}
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
                    key={post._id}
                    post={post}
                    isLiked={Math.floor(Math.random() * 2) === 1 ? true : false}
                    isSaved={Math.floor(Math.random() * 2) === 1 ? true : false}
                    currentUserId={userId}
                    onMediaClick={openMediaViewer}
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
                              action: () => handleDelete(post._id),
                            },
                          ]
                        : []),
                    ]}
                  />
                ))}
          </Box>
        </motion.div>
      </Container>
      {/* <Footer userType={userType} /> */}

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

      {/* Media Viewer Dialog */}
      <MediaViewerDialog
        open={openMediaDialog}
        images={mediaDialogImages}
        title={""}
        selectedImageIndex={selectedMediaImageIndex || 0}
        onClose={closeMediaViewer}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
      />
    </Box>
  );
}
