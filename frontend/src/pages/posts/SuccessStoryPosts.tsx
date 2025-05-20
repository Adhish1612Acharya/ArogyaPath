import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { Filter } from "@/components/Filter/Filter";
import { PostCardSkeleton } from "@/components/PostCards/PostCardSkeleton";
import { motion } from "framer-motion";
import TextField from "@mui/material/TextField";
import MediaViewerDialog from "@/components/MediaViewerDialog/MediaViewerDialog";
import SuccessStoryPostCard from "@/components/PostCards/SuccessStoryPostCard/SuccessStoryPostCard";
import { SuccessStoryType } from "@/types/SuccessStory.types";
import useSuccessStory from "@/hooks/useSuccessStory/useSuccessStory";
import { toast } from "react-toastify";
import { UserOrExpertDetailsType } from "@/types";

export function AllSuccessStoriesPosts() {
  const navigate = useNavigate();
  const { getAllSuccessStories, filterSearch } = useSuccessStory();

  const [userId, setUserId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentPost, setCurrentPost] = useState<SuccessStoryType | null>(null);

  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [selectedMediaImageIndex, setSelectedMediaImageIndex] = useState<
    number | null
  >(null);
  const [mediaDialogImages, setMediaDialogImages] = useState<string[]>([]);

  // Dummy data for success stories
  const [successStories, setSuccessStories] = useState<SuccessStoryType[]>([]);

  const getAllSuccessStoriesPosts = async () => {
    try {
      setIsLoading(true);
      // In a real app, you would fetch from your API here
      const response = await getAllSuccessStories();
      setSuccessStories(response?.successStories);
      setUserId(response.userId);
    } catch (error: any) {
      console.error("Error fetching routines:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllSuccessStoriesPosts();
  }, []);

  const handleEdit = (post: SuccessStoryType) => {
    setCurrentPost(post);
    setOpenEditDialog(true);
  };

  const handleDelete = (postId: string) => {
    setSuccessStories((prevPosts) =>
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

  const isPostAuthor = (post: SuccessStoryType) => {
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

  const addVerifiedExpert = (
    postId: string,
    expert: UserOrExpertDetailsType
  ) => {
    console.log("Add Verified expert : ", expert);
    setSuccessStories((prev) =>
      prev.map((post) =>
        post._id === postId
          ? {
              ...post, // copy post
              verified: [...post.verified, expert], // copy verified
              verifyAuthorization: false,
              alreadyVerified: true,
            }
          : post
      )
    );
  };

  const applyFilters = async (filters: string) => {
    try {
      setIsLoading(true);
      const response = await filterSearch(filters);
      setSuccessStories(response.successStories);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Filter failed:", error.message);
      if (error.status === 401) navigate("/auth");
    }
  };

  return (
    <Box className="w-screen bg-gray-50 flex flex-col">
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
              <Filter
                applyFilters={applyFilters}
                getAllPosts={getAllSuccessStoriesPosts}
              />
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
                  <SuccessStoryPostCard
                    key={post._id}
                    post={post}
                    isLiked={Math.floor(Math.random() * 2) === 1 ? true : false}
                    isSaved={Math.floor(Math.random() * 2) === 1 ? true : false}
                    currentUserId={userId}
                    addVerifiedExpert={addVerifiedExpert}
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
