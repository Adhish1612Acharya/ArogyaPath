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
  Calendar,
  Bookmark,
} from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function PostsPage() {
  const [userType] = useState<'expert' | 'patient'>('patient');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userType={userType} />
      
      <main className="container mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Health Feed
            </h1>
            <p className="text-gray-600 mt-2">Discover wellness wisdom from expert practitioners</p>
          </div>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link to="/posts/create">
              <Plus className="mr-2 h-4 w-4" /> Create Post
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white p-1 space-x-2">
            <TabsTrigger value="all" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
              All Posts
            </TabsTrigger>
            <TabsTrigger value="general" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
              General
            </TabsTrigger>
            <TabsTrigger value="routines" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
              Routines
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Avatar className="h-12 w-12 cursor-pointer">
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                        </Avatar>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="flex justify-between space-x-4">
                          <Avatar>
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">{post.author.name}</h4>
                            <p className="text-sm text-gray-600">{post.author.credentials}</p>
                            <p className="text-sm text-gray-600">{post.author.experience}</p>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                    <div>
                      <CardTitle className="text-lg hover:text-green-600 transition-colors">
                        {post.author.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Clock className="h-4 w-4" /> 2 hours ago
                        <span>•</span>
                        <BookOpen className="h-4 w-4" /> {post.readTime}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-semibold mb-4 hover:text-green-600 transition-colors">
                    {post.title}
                  </h3>
                  {post.type === 'general' ? (
                    <>
                      <p className="text-gray-600 mb-4">{post.content}</p>
                      {post.image && (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="rounded-lg w-full h-64 object-cover hover:opacity-90 transition-opacity"
                        />
                      )}
                      <div className="flex gap-2 mt-4">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm hover:bg-green-100 transition-colors cursor-pointer"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      {post.activities?.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-4 relative group"
                        >
                          <div className="flex flex-col items-center">
                            <div className="h-4 w-4 rounded-full bg-green-500 group-hover:bg-green-600 transition-colors" />
                            {index < post.activities.length - 1 && (
                              <div className="h-full w-0.5 bg-green-200 group-hover:bg-green-300 transition-colors" />
                            )}
                          </div>
                          <div className="flex-1 p-3 rounded-lg hover:bg-green-50 transition-colors">
                            <p className="font-semibold text-green-700">{activity.time}</p>
                            <p className="text-gray-600">{activity.activity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t bg-gray-50">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex space-x-6 text-gray-500">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(post.id)}
                        className={`hover:text-red-500 ${
                          likedPosts.has(post.id) ? 'text-red-500' : ''
                        }`}
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:text-blue-500">
                        <MessageCircle className="h-4 w-4 mr-1" /> {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:text-green-500">
                        <Share2 className="h-4 w-4 mr-1" /> Share
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSave(post.id)}
                      className={`hover:text-yellow-500 ${
                        savedPosts.has(post.id) ? 'text-yellow-500' : ''
                      }`}
                    >
                      <Bookmark className="h-4 w-4" />
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