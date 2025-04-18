// src/pages/GeneralPostsPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Filter } from '@/components/Filter/Filter';
import { GeneralPostCard } from '@/components/PostCards/GeneralPostCard';
import { PostCardSkeleton } from '@/components/PostCards/PostCardSkeleton';
import { motion } from 'framer-motion';

export function AllGeneralPosts() {
  const [userType] = useState<'expert' | 'patient'>('patient');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
      content: 'Ashwagandha is an ancient medicinal herb with multiple health benefits...',
      image: 'https://images.unsplash.com/photo-1611241893603-3c359704e0ee',
      likes: 124,
      comments: 45,
      readTime: '5 min read',
      tags: ['Herbs', 'Wellness', 'Mental Health'],
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
      content: 'Seasonal Panchakarma is an excellent way to reset your body...',
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
              <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md !text-white">
                <Link to="/posts/create" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Create Post</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {isLoading ? (
              Array(3).fill(0).map((_, index) => (
                <PostCardSkeleton key={index} />
              ))
            ) : (
              posts.map((post) => (
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
          </div>
        </motion.div>
      </main>
      <Footer userType={userType} />
    </div>
  );
}