import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RoutinePostCard } from '@/components/PostCards/RoutinePostCard';
import { RoutinePostCardSkeleton } from '@/components/PostCards/PostCardSkeletons';

interface Author {
  name: string;
  avatar: string;
  credentials: string;
  experience: string;
}

interface Activity {
  time: string;
  activity: string;
}

interface RoutinePost {
  id: string;
  author: Author;
  title: string;
  activities: Activity[];
  likes: number;
  comments: number;
  readTime: string;
  tags: string[];
  createdAt: string;
}

export function RoutinePost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<RoutinePost | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockPost: RoutinePost = {
          id: id || '1456',
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
            { time: '07:30 AM', activity: 'Oil pulling with sesame oil for oral health' },
            { time: '08:00 AM', activity: 'Light breakfast with seasonal fruits and nuts' },
            { time: '12:00 PM', activity: 'Main meal of the day (largest portion)' },
            { time: '06:30 PM', activity: 'Evening walk in nature' },
            { time: '08:00 PM', activity: 'Light dinner with herbal tea' },
            { time: '10:00 PM', activity: 'Meditation and sleep' },
          ],
          likes: 89,
          comments: 23,
          readTime: '3 min read',
          tags: ['Daily Routine', 'Lifestyle', 'Wellness'],
          createdAt: '2023-06-20T08:15:00Z'
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
          <RoutinePostCardSkeleton className="w-full" />
        </div>
      </div>
    );
  }

  if (!post) {
    return <div className="flex items-center w-screen justify-center min-h-screen w-full bg-gray-50">Post not found</div>;
  }

  return (
    <div className="w-screen w-full bg-gray-50">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" className="hover:bg-green-50">
            <Link to="/routines" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to all routines
            </Link>
          </Button>
        </div>

        <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <RoutinePostCard
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