const transformSuccessStory = (story) => {
  return {
    id: story._id.toString(),
    author: {
      name: story.owner?.username || "",
      avatar: story.owner?.profile.profileImage || "",
    },
    title: story.title,
    content: story.description,
    images: story.media?.images || [],
    video: story.media?.video || "",
    document: story.media?.document || "",
    likes: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 20),
    readTime: story.readTime,
    tags: story.filters || [],
    verification: {
      verified: story.verified.length > 0,
      verifiedBy: story.verified.map((doc) => ({
        name: doc.username || "",
        avatar: doc.profile?.profileImage || "",
      })),
    },
    taggedDoctors: story.tagged.map((doc) => ({
      name: doc.username || "",
      avatar: doc.profile?.profileImage || "",
    })),
    activities: story.routines,
    createdAt: story.createdAt,
  };
};

export default transformSuccessStory;
