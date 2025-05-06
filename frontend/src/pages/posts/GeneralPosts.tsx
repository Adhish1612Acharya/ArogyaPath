// src/pages/GeneralPostsPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Filter } from "@/components/Filter/Filter";
import { GeneralPostCard } from "@/components/PostCards/GeneralPostCard";
import { PostCardSkeleton } from "@/components/PostCards/PostCardSkeleton";
import { motion } from "framer-motion";

interface Author {
  id: string;
  name: string;
  avatar: string;
}

interface Comment {
  id: string;
  author: Author;
  text: string;
  createdAt: Date;
  replies?: Comment[];
}

export interface GeneralPostsType {
  id: string;
  author: Author;
  title: string;
  content: string;
  images?: string[];
  video?: string;
  document?: string;
  likes: number;
  comments: number;
  commentsList?: Comment[];
  readTime: string;
  tags: string[];
  createdAt: Date;
}

export function AllGeneralPosts() {
  const [userType] = useState<"expert" | "patient">("patient");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [isLoading] = useState(false);

  // Embedded post data
  const [generalPosts] = useState<GeneralPostsType[]>([
    {
      id: "post-1",
      author: {
        id: "user-1",
        name: "Dr. Sharma",
        avatar: "https://i.pravatar.cc/150?img=11"
      },
      title: "The Power of Turmeric in Ayurveda",
      content: "Turmeric (Curcuma longa) has been used in Ayurveda for centuries as both a culinary spice and medicinal herb. Its active compound curcumin has powerful anti-inflammatory effects and is a very strong antioxidant. In Ayurvedic practice, turmeric is used to balance all three doshas - though in excess it can aggravate pitta and vata.",
      images: [
        "https://images.unsplash.com/photo-1603048719539-04d7f370038e",
        "https://images.unsplash.com/photo-1603569283847-aa295f0d016a",
        "https://images.unsplash.com/photo-1597362925123-77861d3fbac7",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
        "https://images.unsplash.com/photo-1571019614243-c4cd4a0d058d"
      ],
      likes: 42,
      comments: 3,
      commentsList: [
        {
          id: "comment-1",
          author: {
            id: "user-2",
            name: "Vaidya Patel",
            avatar: "https://i.pravatar.cc/150?img=12"
          },
          text: "Great explanation! I often recommend turmeric with black pepper to enhance absorption.",
          createdAt: new Date("2023-05-15T10:30:00"),
          replies: [
            {
              id: "reply-1",
              author: {
                id: "user-3",
                name: "Ayush Kumar",
                avatar: "https://i.pravatar.cc/150?img=13"
              },
              text: "Yes! The piperine in black pepper increases curcumin absorption by 2000%!",
              createdAt: new Date("2023-05-15T11:45:00")
            }
          ]
        },
        {
          id: "comment-2",
          author: {
            id: "user-4",
            name: "Dr. Nair",
            avatar: "https://i.pravatar.cc/150?img=14"
          },
          text: "Have you found golden milk to be effective for arthritis patients?",
          createdAt: new Date("2023-05-16T08:15:00")
        }
      ],
      readTime: "3 min read",
      tags: ["Ayurveda", "Herbs", "Remedies"],
      createdAt: new Date("2023-05-10T09:00:00")
    },
    {
      id: "post-2",
      author: {
        id: "user-5",
        name: "Prof. Gupta",
        avatar: "https://i.pravatar.cc/150?img=15"
      },
      title: "Understanding Your Dosha",
      content: "The three doshas - Vata, Pitta, and Kapha - are fundamental to Ayurvedic medicine. Each represents a combination of elements and qualities: Vata (air + space = mobile), Pitta (fire + water = transformative), Kapha (earth + water = stable). Most people have one or two dominant doshas that influence their physical, mental and emotional characteristics.",
      images: [
        "https://images.unsplash.com/photo-1580655653888-2d1f58b236b5"
      ],
      likes: 28,
      comments: 5,
      readTime: "4 min read",
      tags: ["Ayurveda", "Health", "Doshas"],
      createdAt: new Date("2023-05-08T14:20:00")
    },
    {
      id: "post-3",
      author: {
        id: "user-6",
        name: "Dr. Desai",
        avatar: "https://i.pravatar.cc/150?img=16"
      },
      title: "Daily Routines for Better Health",
      content: "Dinacharya (daily routine) is central to Ayurveda. An ideal routine includes waking before sunrise, tongue scraping, oil pulling, self-massage with warm oil (abhyanga), yoga or exercise, meditation, and eating meals at consistent times. These practices help align our biological rhythms with nature's cycles for optimal health.",
      images: [
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
        "https://images.unsplash.com/photo-1545205597-3d9d02c29597"
      ],
      likes: 35,
      comments: 2,
      readTime: "5 min read",
      tags: ["Routine", "Wellness", "Yoga"],
      createdAt: new Date("2023-05-05T07:45:00")
    },
    {
      id: "post-4",
      author: {
        id: "user-7",
        name: "Dr. Iyer",
        avatar: "https://i.pravatar.cc/150?img=17"
      },
      title: "Herbal Remedies for Common Ailments",
      content: "Ayurveda offers natural solutions for everyday health concerns: Tulsi (holy basil) for colds and respiratory issues, Ashwagandha for stress and fatigue, Triphala for digestion, Brahmi for brain function, and Neem for skin conditions. Always consult an Ayurvedic practitioner for proper dosage and combinations suited to your constitution.",
      images: [],
      likes: 19,
      comments: 0,
      readTime: "3 min read",
      tags: ["Herbs", "Remedies", "Natural"],
      createdAt: new Date("2023-05-03T12:10:00")
    },
    {
      id: "post-5",
      author: {
        id: "user-8",
        name: "Dr. Menon",
        avatar: "https://i.pravatar.cc/150?img=18"
      },
      title: "The Science Behind Ayurvedic Practices",
      content: "Modern research is validating many Ayurvedic concepts. Studies show meditation reduces stress hormones, turmeric has anti-cancer properties, yoga improves cardiovascular health, and pranayama enhances lung function. The gut-brain connection recognized by modern science parallels Ayurveda's agni (digestive fire) and ojas (vitality) concepts.",
      images: [
        "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe",
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
        "https://images.unsplash.com/photo-1571019614243-c4cd4a0d058d"
      ],
      likes: 56,
      comments: 7,
      readTime: "4 min read",
      tags: ["Science", "Research", "Ayurveda"],
      createdAt: new Date("2023-05-01T16:30:00")
    }
  ]);

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      return newLiked;
    });
  };

  const toggleSave = (postId: string) => {
    setSavedPosts((prev) => {
      const newSaved = new Set(prev);
      if (newSaved.has(postId)) {
        newSaved.delete(postId);
      } else {
        newSaved.add(postId);
      }
      return newSaved;
    });
  };

  const handleAddComment = (postId: string, commentText: string) => {
    // In a real app, you would update state here
    console.log(`Adding comment to post ${postId}: ${commentText}`);
  };

  const handleAddReply = (postId: string, commentId: string, replyText: string) => {
    // In a real app, you would update state here
    console.log(`Adding reply to comment ${commentId} in post ${postId}: ${replyText}`);
  };

  return (
    <div className="min-h-screen w-screen bg-gray-50 flex flex-col">
      <Navbar userType={userType} />
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                General Ayurvedic Posts
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Discover knowledge and insights from Ayurvedic experts
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Filter />
              <Button
                asChild
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md !text-white"
              >
                <Link to="/posts/create" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Create Post</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {isLoading
              ? Array(3)
                  .fill(0)
                  .map((_, index) => <PostCardSkeleton key={index} />)
              : generalPosts.map((generalPost) => (
                  <GeneralPostCard
                    key={generalPost.id}
                    post={generalPost}
                    liked={likedPosts.has(generalPost.id)}
                    saved={savedPosts.has(generalPost.id)}
                    onLike={() => toggleLike(generalPost.id)}
                    onSave={() => toggleSave(generalPost.id)}
                    onComment={(comment) => handleAddComment(generalPost.id, comment)}
                    onReply={(commentId, reply) => handleAddReply(generalPost.id, commentId, reply)}
                  />
                ))}
          </div>
        </motion.div>
      </main>
      <Footer userType={userType} />
    </div>
  );
}