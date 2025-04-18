// src/pages/SuccessStoriesPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Filter } from '@/components/Filter/Filter';
import { SuccessStoryCard } from '@/components/PostCards/SuccessStoryCard';
import { PostCardSkeleton } from '@/components/PostCards/PostCardSkeleton';
import { motion } from 'framer-motion';

export function AllSuccessStoriesPosts() {
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
      id: '3',
      type: 'success',
      author: {
        name: 'Rahul Mehta',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      },
      title: 'My Journey with Ayurveda for Diabetes',
      content: 'After struggling with type 2 diabetes for years...',
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
      content: 'After being diagnosed with PCOS...',
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
    }
  ];

  // ... (keep the same toggleLike and toggleSave functions from GeneralPostsPage)

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
                Success Stories
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Real people, real results with Ayurveda
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
          </div>
        </motion.div>
      </main>
      <Footer userType={userType} />
    </div>
  );
}