import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  BookOpen,
  Bookmark,
} from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Filter } from '@/components/Filter/Filter';

export function PostsPage() {
  const [userType] = useState<'expert' | 'patient'>('patient');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'all' | 'general' | 'routine'>('all');

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
      content:
        'Ashwagandha is an ancient medicinal herb with multiple health benefits. Known for its adaptogenic properties, it helps reduce stress and anxiety while boosting energy levels and improving concentration.',
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
        { time: '06:30 AM', activity: 'Yoga and Pranayama' },
        { time: '07:30 AM', activity: 'Light breakfast with seasonal fruits' },
        { time: '09:00 AM', activity: 'Start work with regular breaks' },
        { time: '01:00 PM', activity: 'Balanced lunch following Ayurvedic principles' },
      ],
      likes: 89,
      comments: 23,
      readTime: '3 min read',
      tags: ['Daily Routine', 'Lifestyle', 'Wellness'],
    },
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar userType={userType} />
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Health Feed
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Discover wellness wisdom from expert practitioners
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Filter />
            <Button asChild className="bg-green-600 hover:bg-green-700 shadow-md !text-white">
              <Link to="/posts/create" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create Post</span>
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
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
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-6 space-y-6">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0 shadow-sm"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-4">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 cursor-pointer border-2 border-green-100">
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                        </Avatar>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80 shadow-xl">
                        <div className="flex space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">{post.author.name}</h4>
                            <p className="text-xs text-gray-600">{post.author.credentials}</p>
                            <p className="text-xs text-gray-600">{post.author.experience}</p>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                    <div className="flex-1">
                      <CardTitle className="text-base sm:text-lg hover:text-green-600 transition-colors">
                        {post.author.name}
                      </CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                          2 hours ago
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                          {post.readTime}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-3 hover:text-green-600 transition-colors">
                    {post.title}
                  </h3>
                  {post.type === 'general' ? (
                    <>
                      <p className="text-gray-600 mb-4 text-sm sm:text-base">{post.content}</p>
                      {post.image && (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="rounded-lg w-full h-48 sm:h-64 object-cover hover:opacity-90 transition-opacity"
                        />
                      )}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 bg-green-50 text-green-700 rounded-full text-xs sm:text-sm hover:bg-green-100 transition-colors cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4 mt-4">
                      {post.activities?.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-4 relative group"
                        >
                          <div className="flex flex-col items-center pt-1">
                            <div className="h-3 w-3 rounded-full bg-green-500 group-hover:bg-green-600 transition-colors" />
                            {index < post.activities.length - 1 && (
                              <div className="h-full w-0.5 bg-green-200 group-hover:bg-green-300 transition-colors" />
                            )}
                          </div>
                          <div className="flex-1 p-3 rounded-lg hover:bg-green-50 transition-colors">
                            <p className="font-medium text-sm text-green-700">{activity.time}</p>
                            <p className="text-gray-600 text-sm">{activity.activity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t bg-gray-50 px-4 py-3">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex space-x-4 sm:space-x-6 text-gray-500">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(post.id)}
                        className={`h-8 px-2 hover:text-red-500 ${
                          likedPosts.has(post.id) ? 'text-red-500' : ''
                        }`}
                      >
                        <Heart className="h-4 w-4 mr-1.5" />
                        <span className="text-xs sm:text-sm">
                          {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 hover:text-blue-500"
                      >
                        <MessageCircle className="h-4 w-4 mr-1.5" />
                        <span className="text-xs sm:text-sm">{post.comments}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 hover:text-green-500"
                      >
                        <Share2 className="h-4 w-4 mr-1.5" />
                        <span className="text-xs sm:text-sm">Share</span>
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSave(post.id)}
                      className={`h-8 w-8 p-0 hover:text-yellow-500 ${
                        savedPosts.has(post.id) ? 'text-yellow-500' : ''
                      }`}
                    >
                      <Bookmark
                        className={`h-4 w-4 transition-transform ${
                          savedPosts.has(post.id) ? 'fill-current' : ''
                        }`}
                      />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
      <Footer userType={userType} />
    </div>
  );
}