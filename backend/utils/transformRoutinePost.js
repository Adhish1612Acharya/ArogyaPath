const transformRoutine = (routine) => ({
  id: routine._id.toString(),
  author: {
    id: routine.owner._id?.toString?.() || routine.owner.toString(),
    name: routine.owner.username,
    avatar: routine.owner.profile.profileImage,
  },
  title: routine.title,
  content: routine.description,
  thumbnail: routine.thumbnail || "",
  activities: routine.routines || [],
  likes: Math.floor(Math.random() * 100),
  comments: Math.floor(Math.random() * 20),
  readTime: routine.readTime,
  tags: routine.filters || [],
  createdAt: routine.createdAt,
});

export default transformRoutine;
