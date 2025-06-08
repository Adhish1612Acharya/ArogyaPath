import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import { GeneralPostCardSkeleton } from "@/components/PostCards/PostCardSkeletons";
import GeneralPostCard from "@/components/PostCards/GeneralPostCard/GeneralPostCard";
import usePost from "@/hooks/usePost/usePost";
import { GeneralPostType } from "@/types/GeneralPost.types";
import MediaViewerDialog from "@/components/MediaViewerDialog/MediaViewerDialog";
import { Delete, Edit } from "@mui/icons-material";

export function GeneralPost() {
  const { getPostById } = usePost();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<GeneralPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [_openEditDialog, setOpenEditDialog] = useState(false);
  const [_currentPost, setCurrentPost] = useState<GeneralPostType | null>(null);
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [selectedMediaImageIndex, setSelectedMediaImageIndex] = useState<
    number | null
  >(null);
  const [mediaDialogImages, setMediaDialogImages] = useState<string[]>([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) return;
        if (!id) return;
        const ssData = await getPostById(id);

        setPost(ssData.post);
        setLoading(false);
      } catch (error: any) {
        console.log("Error : ", error);
        if (error.status === 400)
          navigate(`/auth?redirect=${encodeURIComponent(location.pathname)}`);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      const ssData = await getPostById(id);

      setPost(ssData.post);
      setUserId(ssData.userId);
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  const handleEdit = (post: GeneralPostType) => {
    setCurrentPost(post);
    setOpenEditDialog(true);
  };

  const handleDelete = (_postId: string) => {
    // setGeneralPosts((prevPosts) =>
    //   prevPosts.filter((post) => post._id !== postId)
    // );
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

  const isPostAuthor = (post: GeneralPostType) => {
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

  if (loading) {
    return (
      <div className="flex items-center w-screen justify-center min-h-screen w-full bg-gray-50">
        <div className="w-full w-screen max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <GeneralPostCardSkeleton />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">
        Post not found
      </div>
    );
  }

  return (
    <div className="w-screen  w-full bg-gray-50">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" className="hover:bg-green-50">
            <Link to="/gposts" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to all posts
            </Link>
          </Button>
        </div>

        <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <GeneralPostCard
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
        </div>
      </div>

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
    </div>
  );
}
