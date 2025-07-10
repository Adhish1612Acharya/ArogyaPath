import { useState, useRef, FC } from "react";
import { Card, Divider, Collapse } from "@mui/material";
import { styled } from "@mui/material/styles";
import { SuccessStoryCardProps } from "./SuccessStoryPostCard.types";
import { AuthorSection } from "./Sections/AuthorSection";
import { TaggedDoctors } from "./Sections/TaggedDoctors";
import { PostContent } from "./Sections/PostContent";
import { RoutinesSection } from "./Sections/RoutinesSection";
import { PostActions } from "./Sections/PostActions";
import CommentSection from "../CommentSection/CommentSection";
import { PostMenu } from "./Sections/PostMenu";
import { VerifiersDialog, InvalidDialog } from "./Sections/VerificationDialogs";
import ShareMenu from "../../ShareMenu/ShareMenu";
import type { Comment } from "@/types/Comment.types";
import useSuccessStory from "@/hooks/useSuccessStory/useSuccessStory";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius) * 2,
  overflow: "hidden",
  transition: "all 0.3s ease",
  boxShadow: theme.shadows[2],
  border: `1px solid ${theme.palette.grey[200]}`,
  "&:hover": {
    boxShadow: theme.shadows[6],
    transform: "translateY(-4px)",
  },
}));

const SuccessStoryPostCard: FC<SuccessStoryCardProps> = ({
  post,
  isLiked,
  isSaved,
  currentUserId,
  menuItems,
  onMediaClick,
}) => {
  const { verifySuccessStory } = useSuccessStory();

  const commentInputRef = useRef<HTMLInputElement | null>(null);

  const [commentOpen, setCommentOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [shareAnchorEl, setShareAnchorEl] = useState<null | HTMLElement>(null);
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);
  const [likeCount, setLikeCount] = useState(post.likesCount);
  const [viewCount] = useState(Math.floor(Math.random() * 1000));
  const [verifiersDialogOpen, setVerifiersDialogOpen] = useState(false);
  const [invalidDialogOpen, setInvalidDialogOpen] = useState(false);
  const [invalidReason, setInvalidReason] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "verified" | "invalid" | "unverified"
  >(
    post.alreadyVerified
      ? "verified"
      : post.alreadyRejected
      ? "invalid"
      : "unverified"
  );
  const [showVerifyActions, setShowVerifyActions] = useState(
    post.verifyAuthorization
  );
  const [canVerifyOrInvalidate, setCanVerifyOrInvalidate] = useState<boolean>(
    post.verifyAuthorization
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
  };

  const handleCommentClick = () => {
    setCommentOpen(!commentOpen);
    if (!commentOpen && commentInputRef.current) {
      setTimeout(() => commentInputRef.current?.focus(), 100);
    }
  };

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const toggleSave = () => {
    setSaved(!saved);
  };

  const handleVerify = async () => {
    setVerificationLoading(true);
    try {
      const response = await verifySuccessStory(post._id, "accept");
      if (response?.success) {
        setVerificationStatus("verified");
        setShowVerifyActions(false);
        setVerifiersDialogOpen(true);
        setCanVerifyOrInvalidate(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleMarkInvalid = () => {
    setInvalidDialogOpen(true);
    setShowVerifyActions(false);
  };

  const confirmInvalid = async () => {
    if (!invalidReason.trim()) {
      // Optionally show error toast here
      return;
    }
    setVerificationLoading(true);
    try {
      const response = await verifySuccessStory(
        post._id,
        "reject",
        invalidReason
      );
      if (response?.success) {
        setVerificationStatus("invalid");
        setInvalidDialogOpen(false);
        setCanVerifyOrInvalidate(false);
      }
    } finally {
      setVerificationLoading(false);
    }
  };

  return (
    <StyledCard>
      <AuthorSection
        post={post}
        verificationStatus={verificationStatus}
        showVerifyActions={showVerifyActions}
        setShowVerifyActions={setShowVerifyActions}
        handleMenuOpen={handleMenuOpen}
        handleMarkInvalid={handleMarkInvalid}
        handleVerify={handleVerify}
        canVerifyOrInvalidate={canVerifyOrInvalidate}
      />

      <TaggedDoctors post={post} />

      <PostContent post={post} onMediaClick={onMediaClick} />

      <RoutinesSection routines={post.routines} />

      <PostActions
        liked={liked}
        likeCount={likeCount}
        commentCount={post.commentsCount}
        viewCount={viewCount}
        saved={saved}
        isAuthor={post.owner._id === currentUserId}
        toggleLike={toggleLike}
        handleCommentClick={handleCommentClick}
        handleShareClick={handleShareClick}
        toggleSave={toggleSave}
      />

      <Collapse in={commentOpen} timeout="auto" unmountOnExit>
        <Divider />
        <CommentSection
          comments={comments as any}
          setComments={setComments as any}
          // postId={post._id}
          currentUserId={currentUserId}
          inputRef={commentInputRef as any}
        />
      </Collapse>

      <ShareMenu
        anchorEl={shareAnchorEl}
        open={Boolean(shareAnchorEl)}
        onClose={handleShareClose}
        postTitle={post.title}
      />

      <PostMenu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        menuItems={menuItems}
        handleShareClick={handleShareClick}
      />

      <VerifiersDialog
        open={verifiersDialogOpen}
        onClose={() => setVerifiersDialogOpen(false)}
        verifiers={post.verified}
      />

      <InvalidDialog
        open={invalidDialogOpen}
        onClose={() => setInvalidDialogOpen(false)}
        onConfirm={confirmInvalid}
        reason={invalidReason}
        setReason={setInvalidReason}
        loading={verificationLoading}
      />
    </StyledCard>
  );
};

export default SuccessStoryPostCard;
