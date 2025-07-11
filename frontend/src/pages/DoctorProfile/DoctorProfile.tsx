import {
  Box,
  Button,
  Typography,
  Container,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileHeader from "@/components/DoctorProfile/ProfileHeader/ProfileHeader";
import ContentTabs from "@/components/DoctorProfile/ContentTabs/ContentTabs";
import AboutSection from "@/components/DoctorProfile/AboutSection/AboutSection";
import GeneralPostCard from "@/components/PostCards/GeneralPostCard/GeneralPostCard";
import RoutinePostCard from "@/components/PostCards/RoutinePostCard/RoutinePostCard";
import { GeneralPostCardSkeleton, RoutinePostCardSkeleton } from "@/components/PostCards/PostCardSkeletons";
import { GeneralPostType } from "@/types/GeneralPost.types";
import { RoutinePostType } from "@/types/RoutinesPost.types";

// Local interfaces for doctor profile
interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  isLiked: boolean;
  isBookmarked: boolean;
}

interface Routine {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  title: string;
  description: string;
  image?: string;
  video?: string;
  timestamp: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  likes: number;
  comments: number;
  shares: number;
  exercises: number;
  participants: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isStarted: boolean;
  progress?: number;
}

// Conversion functions
const convertPostToGeneralPost = (post: Post): GeneralPostType => ({
  _id: post.id,
  title: post.content.split('\n')[0].substring(0, 100) + "...", // Use first line as title
  description: post.content,
  media: {
    images: post.image ? [post.image] : [],
    video: null,
    document: null,
  },
  filters: post.tags.map(tag => tag.replace('#', '')),
  readTime: "2 min read",
  likesCount: post.likes,
  commentsCount: post.comments,
  owner: {
    _id: "doctor-1",
    profile: {
      fullName: post.author.name,
      profileImage: post.author.avatar,
    },
  },
  createdAt: new Date(Date.now() - getTimeOffset(post.timestamp)).toISOString(),
});

const convertRoutineToRoutinePost = (routine: Routine): RoutinePostType => ({
  _id: routine.id,
  title: routine.title,
  description: routine.description,
  thumbnail: routine.image || routine.video || null,
  filters: [routine.category, routine.difficulty],
  routines: Array(routine.exercises).fill(0).map((_, i) => ({
    time: `${i + 1} min`,
    content: `Exercise ${i + 1}`,
  })),
  readTime: routine.duration,
  likesCount: routine.likes,
  commentsCount: routine.comments,
  owner: {
    _id: "doctor-1",
    profile: {
      fullName: routine.author.name,
      profileImage: routine.author.avatar,
    },
  },
  createdAt: new Date(Date.now() - getTimeOffset(routine.timestamp)).toISOString(),
});

// Helper function to convert human-readable timestamps to milliseconds
const getTimeOffset = (timestamp: string): number => {
  if (timestamp.includes("hours ago")) {
    const hours = parseInt(timestamp.match(/(\d+)/)?.[0] || "0");
    return hours * 60 * 60 * 1000;
  } else if (timestamp.includes("day ago") || timestamp.includes("days ago")) {
    const days = parseInt(timestamp.match(/(\d+)/)?.[0] || "1");
    return days * 24 * 60 * 60 * 1000;
  } else if (timestamp.includes("week ago") || timestamp.includes("weeks ago")) {
    const weeks = parseInt(timestamp.match(/(\d+)/)?.[0] || "1");
    return weeks * 7 * 24 * 60 * 60 * 1000;
  } else if (timestamp.includes("minute ago") || timestamp.includes("minutes ago")) {
    const minutes = parseInt(timestamp.match(/(\d+)/)?.[0] || "1");
    return minutes * 60 * 1000;
  }
  return 0; // Default to now if can't parse
};

interface Doctor {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  hospital: string;
  university: string;
  verified: boolean;
  rating: number;
  reviews: number;
  experience: number;
  location: string;
  languages: string[];
  email: string;
  phone: string;
  about: string;
  followers: number;
  following: number;
  posts: number;
  education: Array<{
    degree: string;
    university: string;
    year: string;
  }>;
  experienceList: Array<{
    position: string;
    hospital: string;
    period: string;
  }>;
  specializations: string[];
}

const DoctorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [savedItems, setSavedItems] = useState<(Post | Routine)[]>([]);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const mockDoctor: Doctor = {
            id: id || "1",
            name: "Dr. Sarah Johnson",
            avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
            specialty: "Cardiologist & Wellness Expert",
            hospital: "Mount Sinai Hospital",
            university: "Harvard Medical School",
            verified: true,
            rating: 4.8,
            reviews: 1240,
            experience: 15,
            location: "New York, USA",
            languages: ["English", "Spanish", "French"],
            email: "s.johnson@example.com",
            phone: "+91 9999999999",
            about: "💚 Transforming lives through holistic heart health | 🏥 15+ years in interventional cardiology | 🌱 Advocate for preventive care & wellness | 📚 Sharing evidence-based health tips daily",
            followers: 45200,
            following: 180,
            posts: 234,
            education: [
              {
                degree: "MD in Cardiology",
                university: "Harvard Medical School",
                year: "2005-2009",
              },
              {
                degree: "Residency in Internal Medicine",
                university: "Massachusetts General Hospital",
                year: "2009-2012",
              },
              {
                degree: "Fellowship in Interventional Cardiology",
                university: "Johns Hopkins Hospital",
                year: "2012-2015",
              },
            ],
            experienceList: [
              {
                position: "Senior Cardiologist",
                hospital: "Mount Sinai Hospital",
                period: "2015-Present",
              },
              {
                position: "Cardiologist",
                hospital: "New York Presbyterian Hospital",
                period: "2012-2015",
              },
            ],
            specializations: [
              "Interventional Cardiology",
              "Cardiac Catheterization", 
              "Coronary Artery Disease",
              "Heart Failure",
              "Preventive Cardiology"
            ],
          };

          const mockPosts: Post[] = [
            {
              id: "1",
              author: {
                name: mockDoctor.name,
                avatar: mockDoctor.avatar,
                verified: mockDoctor.verified,
              },
              content: "🫀 Heart Health Tip: Did you know that just 30 minutes of brisk walking daily can reduce your risk of heart disease by 35%? Your heart is a muscle - the more you move, the stronger it gets! \n\nWhat's your favorite way to stay active? Share below! 👇",
              image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
              timestamp: "2 hours ago",
              likes: 432,
              comments: 89,
              shares: 23,
              tags: ["#HeartHealth", "#Cardiology", "#Prevention", "#WellnessTip"],
              isLiked: false,
              isBookmarked: false,
            },
            {
              id: "2", 
              author: {
                name: mockDoctor.name,
                avatar: mockDoctor.avatar,
                verified: mockDoctor.verified,
              },
              content: "🥗 Nutrition spotlight: Mediterranean diet isn't just delicious - it's scientifically proven to support heart health! Rich in omega-3s, antioxidants, and healthy fats. \n\nMy patients who follow this eating pattern show remarkable improvements in their cardiovascular markers. Food really is medicine! 💊✨",
              timestamp: "1 day ago",
              likes: 567,
              comments: 124,
              shares: 45,
              tags: ["#MediterraneanDiet", "#Nutrition", "#HeartHealth", "#Prevention"],
              isLiked: true,
              isBookmarked: false,
            },
            {
              id: "3",
              author: {
                name: mockDoctor.name,
                avatar: mockDoctor.avatar,
                verified: mockDoctor.verified,
              },
              content: "🩺 Patient success story: Met with John today - 6 months post cardiac procedure. His dedication to lifestyle changes has been incredible. Blood pressure normalized, cholesterol levels excellent, and he's never felt better! \n\nThis is why I love what I do. Every patient's journey inspires me to keep pushing the boundaries of cardiac care. 💪❤️",
              image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop",
              timestamp: "3 days ago",
              likes: 890,
              comments: 156,
              shares: 67,
              tags: ["#PatientSuccess", "#Cardiology", "#Inspiration", "#Recovery"],
              isLiked: false,
              isBookmarked: true,
            },
          ];

          const mockRoutines: Routine[] = [
            {
              id: "1",
              author: {
                name: mockDoctor.name,
                avatar: mockDoctor.avatar,
                verified: mockDoctor.verified,
              },
              title: "Heart-Healthy Morning Routine",
              description: "Start your day right with this 15-minute cardiac wellness routine. Perfect for beginners and designed by cardiologists.",
              image: "https://images.unsplash.com/photo-1506629905607-47882ab26e84?w=600&h=400&fit=crop",
              timestamp: "5 days ago",
              duration: "15 min",
              difficulty: "Beginner",
              category: "Cardio",
              likes: 1200,
              comments: 234,
              shares: 89,
              exercises: 6,
              participants: 8450,
              isLiked: true,
              isBookmarked: false,
              isStarted: false,
            },
            {
              id: "2",
              author: {
                name: mockDoctor.name,
                avatar: mockDoctor.avatar,
                verified: mockDoctor.verified,
              },
              title: "Stress-Relief Breathing Exercises",
              description: "Evidence-based breathing techniques to lower blood pressure and reduce cardiovascular stress. Used in my clinical practice.",
              video: "https://images.unsplash.com/photo-1506629905607-47882ab26e84?w=600&h=400&fit=crop",
              timestamp: "1 week ago",
              duration: "10 min",
              difficulty: "Beginner", 
              category: "Wellness",
              likes: 756,
              comments: 145,
              shares: 56,
              exercises: 4,
              participants: 5670,
              isLiked: false,
              isBookmarked: true,
              isStarted: true,
              progress: 60,
            },
            {
              id: "3",
              author: {
                name: mockDoctor.name,
                avatar: mockDoctor.avatar,
                verified: mockDoctor.verified,
              },
              title: "Advanced Cardiac Conditioning",
              description: "High-intensity interval training specifically designed for cardiovascular health. Consult your doctor before starting.",
              image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
              timestamp: "2 weeks ago",
              duration: "25 min",
              difficulty: "Advanced",
              category: "HIIT",
              likes: 445,
              comments: 78,
              shares: 34,
              exercises: 8,
              participants: 2340,
              isLiked: false,
              isBookmarked: false,
              isStarted: false,
            },
          ];

          setDoctor(mockDoctor);
          setPosts(mockPosts);
          setRoutines(mockRoutines);
          setSavedItems([
            ...mockPosts.filter(p => p.isBookmarked), 
            ...mockRoutines.filter(r => r.isBookmarked)
          ]);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [id]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleMessage = () => {
    console.log("Message doctor");
  };

  const handleBookAppointment = () => {
    console.log("Book appointment");
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <div className="space-y-6">
          <GeneralPostCardSkeleton />
          <RoutinePostCardSkeleton />
          <GeneralPostCardSkeleton />
        </div>
      </Container>
    );
  }

  if (!doctor) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
          flexDirection="column"
        >
          <Typography variant="h6" gutterBottom>
            Doctor not found
          </Typography>
          <Button variant="contained" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile Header */}
        <ProfileHeader
          doctor={doctor}
          isFollowing={isFollowing}
          onFollow={handleFollow}
          onMessage={handleMessage}
          onBookAppointment={handleBookAppointment}
        />

        {/* Content Tabs */}
        <ContentTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          postsCount={posts.length}
          routinesCount={routines.length}
          savedCount={savedItems.length}
          aboutVisible={true}
        />

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Posts Tab */}
            {activeTab === 0 && (
              <Box>
                {posts.map((post) => (
                  <GeneralPostCard
                    key={post.id}
                    post={convertPostToGeneralPost(post)}
                    isLiked={post.isLiked}
                    isSaved={post.isBookmarked}
                    currentUserId="current-user"
                    onMediaClick={(mediaIndex, images) => {
                      console.log("Media clicked:", mediaIndex, images);
                    }}
                    onEdit={() => console.log("Edit post:", post.id)}
                    onDelete={() => console.log("Delete post:", post.id)}
                  />
                ))}
                {posts.length === 0 && (
                  <Box textAlign="center" py={8}>
                    <Typography variant="h6" color="text.secondary">
                      No posts yet
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* Routines Tab */}
            {activeTab === 1 && (
              <Box>
                {routines.map((routine) => (
                  <RoutinePostCard
                    key={routine.id}
                    post={convertRoutineToRoutinePost(routine)}
                    isLiked={routine.isLiked}
                    isSaved={routine.isBookmarked}
                    currentUserId="current-user"
                    onMediaClick={(mediaIndex, images) => {
                      console.log("Media clicked:", mediaIndex, images);
                    }}
                    onEdit={() => console.log("Edit routine:", routine.id)}
                    onDelete={() => console.log("Delete routine:", routine.id)}
                  />
                ))}
                {routines.length === 0 && (
                  <Box textAlign="center" py={8}>
                    <Typography variant="h6" color="text.secondary">
                      No routines yet
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* Saved Tab */}
            {activeTab === 2 && (
              <Box>
                {savedItems.map((item) => {
                  // Check if item is a routine by checking for 'title' property
                  if ('title' in item) {
                    return (
                      <RoutinePostCard
                        key={item.id}
                        post={convertRoutineToRoutinePost(item as Routine)}
                        isLiked={(item as Routine).isLiked}
                        isSaved={(item as Routine).isBookmarked}
                        currentUserId="current-user"
                        onMediaClick={(mediaIndex, images) => {
                          console.log("Media clicked:", mediaIndex, images);
                        }}
                        onEdit={() => console.log("Edit routine:", item.id)}
                        onDelete={() => console.log("Delete routine:", item.id)}
                      />
                    );
                  } else {
                    return (
                      <GeneralPostCard
                        key={item.id}
                        post={convertPostToGeneralPost(item as Post)}
                        isLiked={(item as Post).isLiked}
                        isSaved={(item as Post).isBookmarked}
                        currentUserId="current-user"
                        onMediaClick={(mediaIndex, images) => {
                          console.log("Media clicked:", mediaIndex, images);
                        }}
                        onEdit={() => console.log("Edit post:", item.id)}
                        onDelete={() => console.log("Delete post:", item.id)}
                      />
                    );
                  }
                })}
                {savedItems.length === 0 && (
                  <Box textAlign="center" py={8}>
                    <Typography variant="h6" color="text.secondary">
                      No saved items yet
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* About Tab */}
            {activeTab === 3 && (
              <AboutSection doctor={doctor} />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </Container>
  );
};

export default DoctorProfile;