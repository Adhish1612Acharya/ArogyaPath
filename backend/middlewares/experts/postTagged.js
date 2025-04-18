import SuccessStory from "../../models/SuccessStory/SuccessStory.js";

export const checkIsTaggedAndVerified = async (req, res, next) => {
  const { id } = req.params;

  const successPost = await SuccessStory.findById(id);

  if (!successPost) {
    return res.status(404).json({
      message: "Post not found",
      success: false,
    });
  }

  const isTagged = successPost.tagged.some((expertId) =>
    expertId.equals(req.user._id)
  );

  const isAlreadyVerified = successPost.verified.some((expertId) =>
    expertId.equals(req.user._id)
  );

  const isTaggingEnabled = successPost.tagged.length > 0;

  // Case 1: No tagging, less than 6 verifications, and not already verified
  if (
    !isTaggingEnabled &&
    successPost.verified.length < 5 &&
    !isAlreadyVerified
  ) {
    return next();
  }

  //  Case 2: Tagging enabled, current expert is tagged and not already verified
  if (isTagged && !isAlreadyVerified) {
    console.log("Is tagged")
    return next();
  }

  //  Edge Case: Tagging enabled, expert is NOT tagged
  if (isTaggingEnabled && !isTagged) {
    return res.status(403).json({
      message: "You are not tagged to verify this post",
      success: false,
    });
  }

  //  Already verified
  if (isAlreadyVerified) {
    return res.status(403).json({
      message: "You have already verified this post",
      success: false,
    });
  }

  // Fallback denial
  return res.status(403).json({
    message: "Access denied",
    success: false,
  });
};
