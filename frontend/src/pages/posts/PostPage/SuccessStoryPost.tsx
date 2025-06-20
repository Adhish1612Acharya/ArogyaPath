import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { SuccessStoryCardSkeleton } from "@/components/PostCards/PostCardSkeletons";
import useSuccessStory from "@/hooks/useSuccessStory/useSuccessStory";
import SuccessStoryPostCard from "@/components/PostCards/SuccessStoryPostCard/SuccessStoryPostCard";
import { SuccessStoryType } from "@/types/SuccessStory.types";
import { useAuth } from "@/context/AuthContext";
import MediaViewerDialog from "@/components/MediaViewerDialog/MediaViewerDialog";
import { Delete, Edit } from "@mui/icons-material";
import { UserOrExpertDetailsType } from "@/types";

export function SuccessStoryPost() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getSuccessStoryById } = useSuccessStory();
  const { setIsLoggedIn, setRole } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<SuccessStoryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [selectedMediaImageIndex, setSelectedMediaImageIndex] = useState<
    number | null
  >(null);
  const [mediaDialogImages, setMediaDialogImages] = useState<string[]>([]);

  const [_openEditDialog, setOpenEditDialog] = useState(false);
  const [_currentPost, setCurrentPost] = useState<SuccessStoryType | null>(null);

  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) return;
        const ssData = await getSuccessStoryById(id);

        setIsLoggedIn(true);
        setRole(ssData.userRole);
        setPost(ssData.successStory);
        setUserId(ssData.userId);
        setLoading(false);
      } catch (error: any) {
        console.log("Error : ", error);
        if (error.status === 400)
          navigate(`/auth?redirect=${encodeURIComponent(location.pathname)}`);
      }
    };

    fetchPost();
  }, [id]);

  const handleEdit = (post: SuccessStoryType) => {
    setCurrentPost(post);
    setOpenEditDialog(true);
  };

  const handleDelete = (_postId: string) => {
    // setSuccessStor((prevPosts) =>
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

  const isPostAuthor = (post: SuccessStoryType) => {
    return post.owner._id === userId;
  };

  // const handleNextImage = () => {
  //   if (mediaDialogImages.length > 0) {
  //     setSelectedMediaImageIndex(
  //       (prev) => (prev ? prev + 1 : 0) % mediaDialogImages.length
  //     );
  //   }
  // };

  // const handlePrevImage = () => {
  //   if (mediaDialogImages.length > 0) {
  //     setSelectedMediaImageIndex(
  //       (prev) =>
  //         (prev ? prev - 1 + mediaDialogImages.length : 0) %
  //         mediaDialogImages.length
  //     );
  //   }
  // };

  const addVerifiedExpert = (
    _postId: string,
    expert: UserOrExpertDetailsType
  ) => {
    console.log("Add Verified expert : ", expert);
    setPost((prev) => {
      if (!prev) return prev; // Return null if post is null

      return {
        ...prev,
        verified: [...prev.verified, expert],
        verifyAuthorization: false,
        alreadyVerified: true,
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen w-full bg-gray-50">
        <div className="w-full w-screen max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <SuccessStoryCardSkeleton />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center w-screen justify-center min-h-screen w-full bg-gray-50">
        Post not found
      </div>
    );
  }

  return (
    <div className="w-screen w-full bg-gray-50">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" className="hover:bg-green-50">
            <Link to="/success-stories" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to all stories
            </Link>
          </Button>
        </div>

        <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
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
        </div>
      </div>

      {/* Media Viewer Dialog */}
      <MediaViewerDialog
        open={openMediaDialog}
        images={mediaDialogImages}
        title={""}
        selectedImageIndex={selectedMediaImageIndex || 0}
        onClose={closeMediaViewer}
        // onNext={handleNextImage}
        // onPrev={handlePrevImage}
      />
    </div>
  );
}
