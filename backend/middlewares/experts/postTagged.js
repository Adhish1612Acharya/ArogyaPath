import SuccessStory from "../../models/SuccessStory/SuccessStory.js";

export const checkIsTaggedAndVerified = async (req, res, next) => {
  const { id } = req.params;

  const successPost = await SuccessStory.findById(id);

  if (!successPost) {
    throw new ExpressError(404, "Post not found");
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
    console.log("Is tagged");
    return next();
  }

  //  Edge Case: Tagging enabled, expert is NOT tagged
  if (isTaggingEnabled && !isTagged) {
    throw new ExpressError(403, "You are not tagged to verify this post");
  }

  // Already verified
  if (isAlreadyVerified) {
    throw new ExpressError(403, "You have already verified this post");
  }

  // Fallback denial
  throw new ExpressError(403, "Access denied");
};
