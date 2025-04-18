import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus  } from 'lucide-react';
import { Filter } from '@/components/Filter/Filter';
import { GeneralPostCard } from '@/components/PostCards/GeneralPostCard';
import { RoutinePostCard } from '@/components/PostCards/RoutinePostCard';
import { SuccessStoryCard } from '@/components/PostCards/SuccessStoryCard';
import { PostCardSkeleton } from '@/components/PostCards/PostCardSkeleton';
import { motion } from 'framer-motion';

export function PostsPage() {
  const [userType] = useState<'expert' | 'patient'>('patient');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'all' | 'general' | 'routine' | 'success'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const posts = [
    {
      id: '1',
      type: 'general',
      author: {
        name: 'Dr. Ayush Kumar',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d',
        credentials: 'BAMS, MD Ayurveda',
        experience: '15 years of experience',
      },
      title: 'Benefits of Ashwagandha',
      content: 'Ashwagandha is an ancient medicinal herb with multiple health benefits. Known for its adaptogenic properties, it helps reduce stress and anxiety while boosting energy levels and improving concentration. Regular consumption can help balance cortisol levels and support adrenal function.',
      image: 'https://images.unsplash.com/photo-1611241893603-3c359704e0ee',
      likes: 124,
      comments: 45,
      readTime: '5 min read',
      tags: ['Herbs', 'Wellness', 'Mental Health'],
    },
    {
      id: '2',
      type: 'routine',
      author: {
        name: 'Dr. Priya Sharma',
        avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f',
        credentials: 'PhD in Ayurveda',
        experience: '12 years of experience',
      },
      title: 'Daily Wellness Routine',
      activities: [
        { time: '06:00 AM', activity: 'Wake up and drink warm water with lemon' },
        { time: '06:30 AM', activity: 'Yoga and Pranayama (Kapalbhati, Anulom Vilom)' },
        { time: '07:30 AM', activity: 'Light breakfast with seasonal fruits and nuts' },
        { time: '09:00 AM', activity: 'Start work with regular breaks every 45 minutes' },
        { time: '01:00 PM', activity: 'Balanced lunch following Ayurvedic principles' },
        { time: '06:30 PM', activity: 'Evening walk in nature' },
        { time: '08:00 PM', activity: 'Light dinner with herbal tea' },
        { time: '10:00 PM', activity: 'Meditation and sleep' },
      ],
      likes: 89,
      comments: 23,
      readTime: '3 min read',
      tags: ['Daily Routine', 'Lifestyle', 'Wellness'],
    },
    {
      id: '3',
      type: 'success',
      author: {
        name: 'Rahul Mehta',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      },
      title: 'My Journey with Ayurveda for Diabetes',
      content: 'After struggling with type 2 diabetes for years, I turned to Ayurveda. With the help of Dr. Sharma and a disciplined routine, I was able to reduce my HbA1c from 8.5 to 6.2 in just 6 months. The combination of diet, herbs (like bitter melon and fenugreek), and lifestyle changes truly transformed my health. I no longer need medication and have more energy than ever before.',
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352',
      likes: 215,
      comments: 78,
      readTime: '7 min read',
      tags: ['Success Story', 'Diabetes', 'Ayurvedic Treatment'],
      verification: {
        verified: true,
        verifiedBy: [
          {
            name: 'Dr. Neha Patel',
            avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2',
            credentials: 'MD Ayurveda, Diabetes Specialist'
          }
        ]
      },
      taggedDoctors: [
        {
          name: 'Dr. Priya Sharma',
          avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f',
          credentials: 'PhD in Ayurveda'
        }
      ]
    },
    {
      id: '4',
      type: 'success',
      author: {
        name: 'Sunita Rao',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
      },
      title: 'Overcoming PCOS Naturally',
      content: 'After being diagnosed with PCOS, I was prescribed multiple medications with side effects. Ayurveda provided a holistic approach that addressed the root cause. With dietary changes (avoiding processed foods), herbal supplements (like shatavari and ashoka), and yoga, my symptoms improved significantly within 4 months. My menstrual cycle regulated, and I lost 8 kg naturally.',
      image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
      likes: 178,
      comments: 42,
      readTime: '6 min read',
      tags: ['PCOS', 'Women Health', 'Natural Healing'],
      verification: {
        verified: false
      },
      taggedDoctors: [
        {
          name: 'Dr. Anjali Deshpande',
          avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2',
          credentials: 'BAMS, Women Health Specialist'
        }
      ]
    },
    {
      id: '5',
      type: 'general',
      author: {
        name: 'Dr. Rajesh Verma',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d',
        credentials: 'MD Ayurveda, Panchakarma Specialist',
        experience: '18 years of experience',
      },
      title: 'Detox with Seasonal Panchakarma',
      content: 'Seasonal Panchakarma is an excellent way to reset your body according to the changing seasons. The monsoon season is particularly good for treatments like Abhyanga (oil massage) and Swedana (herbal steam). These therapies help remove accumulated toxins and prepare your body for the coming season.',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874',
      likes: 92,
      comments: 31,
      readTime: '4 min read',
      tags: ['Panchakarma', 'Detox', 'Seasonal Care'],
    }
  ];

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

  const filteredPosts =
    activeTab === 'all'
      ? posts
      : posts.filter((post) => post.type === activeTab);

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
             
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent ">
                Ayurvedic Wellness Feed
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Discover ancient wisdom and modern success stories
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Filter />
              <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md !text-white">
                <Link to="/posts/create" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Create Post</span>
                </Link>
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
  <div className="overflow-x-auto pb-2">
    <TabsList className="bg-white p-1 space-x-2 w-max">
      <TabsTrigger
        value="all"
        className="px-4 py-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:shadow-sm"
      >
        All Posts
      </TabsTrigger>
      <TabsTrigger
        value="general"
        className="px-4 py-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:shadow-sm"
      >
        General
      </TabsTrigger>
      <TabsTrigger
        value="routine"
        className="px-4 py-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:shadow-sm"
      >
        Routines
      </TabsTrigger>
      <TabsTrigger
        value="success"
        className="px-4 py-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:shadow-sm"
      >
        Success Stories
      </TabsTrigger>
    </TabsList>
  </div>

  {/* All Tab Content */}
  <TabsContent value="all" className="mt-6 space-y-6">
    {isLoading ? (
      Array(3).fill(0).map((_, index) => (
        <PostCardSkeleton key={index} />
      ))
    ) : (
      filteredPosts.map((post) => {
        if (post.type === 'general') {
          return (
            <GeneralPostCard
              key={post.id}
              post={post}
              liked={likedPosts.has(post.id)}
              saved={savedPosts.has(post.id)}
              onLike={() => toggleLike(post.id)}
              onSave={() => toggleSave(post.id)}
            />
          );
        } else if (post.type === 'routine') {
          return (
            <RoutinePostCard
              key={post.id}
              post={post}
              liked={likedPosts.has(post.id)}
              saved={savedPosts.has(post.id)}
              onLike={() => toggleLike(post.id)}
              onSave={() => toggleSave(post.id)}
            />
          );
        } else if (post.type === 'success') {
          return (
            <SuccessStoryCard
              key={post.id}
              post={post}
              liked={likedPosts.has(post.id)}
              saved={savedPosts.has(post.id)}
              onLike={() => toggleLike(post.id)}
              onSave={() => toggleSave(post.id)}
            />
          );
        }
        return null;
      })
    )}
  </TabsContent>

  {/* General Tab Content */}
  <TabsContent value="general" className="mt-6 space-y-6">
    {isLoading ? (
      Array(3).fill(0).map((_, index) => (
        <PostCardSkeleton key={index} />
      ))
    ) : (
      posts
        .filter(post => post.type === 'general')
        .map((post) => (
          <GeneralPostCard
            key={post.id}
            post={post}
            liked={likedPosts.has(post.id)}
            saved={savedPosts.has(post.id)}
            onLike={() => toggleLike(post.id)}
            onSave={() => toggleSave(post.id)}
          />
        ))
    )}
  </TabsContent>

  {/* Routine Tab Content */}
  <TabsContent value="routine" className="mt-6 space-y-6">
    {isLoading ? (
      Array(3).fill(0).map((_, index) => (
        <PostCardSkeleton key={index} />
      ))
    ) : (
      posts
        .filter(post => post.type === 'routine')
        .map((post) => (
          <RoutinePostCard
            key={post.id}
            post={post}
            liked={likedPosts.has(post.id)}
            saved={savedPosts.has(post.id)}
            onLike={() => toggleLike(post.id)}
            onSave={() => toggleSave(post.id)}
          />
        ))
    )}
  </TabsContent>

  {/* Success Stories Tab Content */}
  <TabsContent value="success" className="mt-6 space-y-6">
    {isLoading ? (
      Array(3).fill(0).map((_, index) => (
        <PostCardSkeleton key={index} />
      ))
    ) : (
      posts
        .filter(post => post.type === 'success')
        .map((post) => (
          <SuccessStoryCard
            key={post.id}
            post={post}
            liked={likedPosts.has(post.id)}
            saved={savedPosts.has(post.id)}
            onLike={() => toggleLike(post.id)}
            onSave={() => toggleSave(post.id)}
          />
        ))
    )}
  </TabsContent>
</Tabs>
        </motion.div>
      </main>
      <Footer userType={userType} />
    </div>
  );
}