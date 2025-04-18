import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SuccessStoryCard } from '@/components/PostCards/SuccessStoryCard';
import { SuccessStoryCardSkeleton } from '@/components/PostCards/PostCardSkeletons';

interface Author {
  name: string;
  avatar: string;
}

interface Doctor {
  name: string;
  avatar: string;
  credentials: string;
}

interface Verification {
  verified: boolean;
  verifiedBy?: Doctor[];
}

interface SuccessStoryPost {
  id: string;
  author: Author;
  title: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  readTime: string;
  tags: string[];
  verification: Verification;
  taggedDoctors?: Doctor[];
  createdAt: string;
  condition: string;
  duration: string;
  improvements: string[];
}

export function SuccessStoryPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<SuccessStoryPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockPost: SuccessStoryPost = {
          id: id || '1234',
          author: {
            name: 'Rahul Mehta',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
          },
          title: 'My Journey with Ayurveda for Diabetes',
          content: 'After struggling with type 2 diabetes for years, I turned to Ayurveda as a last resort. Conventional medicine was helping but the side effects were unbearable.\n\nUnder the guidance of Dr. Sharma, I adopted a comprehensive Ayurvedic regimen:\n- Dietary changes (reducing processed foods, increasing bitter gourd)\n- Daily yoga and pranayama\n- Herbal supplements (fenugreek, turmeric, amla)\n- Stress management techniques\n\nWithin 6 months, my HbA1c dropped from 8.5 to 6.2. I was able to reduce my medication dosage by half. The most remarkable change was in my energy levels - I feel like I\'ve regained 10 years of my life!',
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
          ],
          createdAt: '2023-04-10T14:30:00Z',
          condition: 'Type 2 Diabetes',
          duration: '6 months',
          improvements: [
            'HbA1c reduced from 8.5 to 6.2',
            'Medication reduced by 50%',
            'Energy levels significantly improved',
            'Weight loss of 8 kg',
            'Better sleep quality'
          ]
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
      <div className="flex items-center justify-center w-screen w-full bg-gray-50">
        <div className="w-full w-screen max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <SuccessStoryCardSkeleton  />
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
            <Link to="/success-stories" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to all stories
            </Link>
          </Button>
        </div>

        <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <SuccessStoryCard
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