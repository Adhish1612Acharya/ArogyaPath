const transformPost = (post) => ({
  id: post._id.toString(),
  author: {
    id: post.owner._id.toString(),
    name: post.owner.username,
    avatar: post.owner.profile.profileImage,
  },
  title: post.title,
  content: post.description,
  images: post.media?.images || [],
  video: post.media?.video || undefined,
  document: post.media?.document || undefined,
  likes: Math.floor(Math.random() * 100),
  comments: Math.floor(Math.random() * 20),
  readTime: post.readTime,
  tags: post.filters || [],
  createdAt: post.createdAt,
});

export default transformPost;
