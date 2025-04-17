import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { GeneralPostCard } from '@/components/PostCards/GeneralPostCard';
import { GeneralPostCardSkeleton } from '@/components/PostCards/PostCardSkeletons';

interface Author {
  name: string;
  avatar: string;
  credentials: string;
  experience: string;
}

interface GeneralPost {
  id: string;
  author: Author;
  title: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  readTime: string;
  tags: string[];
  createdAt: string;
}

export function GeneralPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<GeneralPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockPost: GeneralPost = {
          id: id || '425616',
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
          createdAt: '2023-05-15T10:30:00Z',
        };

        setPost(mockPost);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center w-screen justify-center min-h-screen w-full bg-gray-50">
        <div className="w-full w-screen max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <GeneralPostCardSkeleton className="w-full" />
        </div>
      </div>
    );
  }

  if (!post) {
    return <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">Post not found</div>;
  }

  return (
    <div className="w-screen  w-full bg-gray-50">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" className="hover:bg-green-50">
            <Link to="/gposts" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to all posts
            </Link>
          </Button>
        </div>

        <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <GeneralPostCard
            post={post}
            liked={liked}
            saved={saved}
            onLike={() => setLiked(!liked)}
            onSave={() => setSaved(!saved)}
            className="w-full"
            showFullContent={true}
          />
        </div>
      </div>
    </div>
  );
}