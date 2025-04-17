import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneralPostCard } from '@/components/PostCards/GeneralPostCard';
import { RoutinePostCard } from '@/components/PostCards/RoutinePostCard';
import { SuccessStoryCard } from '@/components/PostCards/SuccessStoryCard';
import { 
  GeneralPostCardSkeleton,
  RoutinePostCardSkeleton,
  SuccessStoryCardSkeleton
} from '@/components/PostCards/PostCardSkeletons';

const AISearchPage = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    generalPosts: any[];
    routines: any[];
    successStories: any[];
  } | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setResults(null);
    
    // Simulate API call to Gemini
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock data with 3 examples for each type
    setResults({
      generalPosts: [
        {
          id: '1',
          author: {
            name: 'Dr. Ayush Kumar',
            avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d',
            credentials: 'BAMS, MD Ayurveda',
            experience: '15 years'
          },
          title: 'Understanding Ayurvedic Herbs for Immunity',
          content: 'Explore the top 5 Ayurvedic herbs that can naturally boost your immune system. Ashwagandha, Tulsi, Turmeric, Amla and Guduchi have remarkable immunomodulatory properties that help strengthen your body\'s natural defense mechanisms.',
          image: 'https://images.unsplash.com/photo-1611241893603-3c359704e0ee',
          likes: 124,
          comments: 45,
          readTime: '5 min read',
          tags: ['Immunity', 'Herbs', 'Wellness'],
          createdAt: '2023-05-15'
        },
        {
          id: '2',
          author: {
            name: 'Dr. Neha Patel',
            avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2',
            credentials: 'MD Ayurveda',
            experience: '10 years'
          },
          title: 'Managing Stress with Ayurveda',
          content: 'Chronic stress affects all three doshas but primarily impacts Vata. Learn how to balance your nervous system through dietary changes, herbs like Brahmi and Ashwagandha, and daily self-care practices including Abhyanga massage.',
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
          likes: 98,
          comments: 32,
          readTime: '4 min read',
          tags: ['Stress', 'Mental Health', 'Vata'],
          createdAt: '2023-07-22'
        },
        {
          id: '3',
          author: {
            name: 'Dr. Rajesh Verma',
            avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d',
            credentials: 'Panchakarma Specialist',
            experience: '18 years'
          },
          title: 'Seasonal Detox with Panchakarma',
          content: 'Discover how seasonal Panchakarma treatments can help remove deep-seated toxins (ama) from your tissues. The monsoon season is particularly effective for treatments like Abhyanga and Swedana to prepare your body for the coming season.',
          image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874',
          likes: 156,
          comments: 42,
          readTime: '6 min read',
          tags: ['Detox', 'Panchakarma', 'Seasonal'],
          createdAt: '2023-04-10'
        }
      ],
      routines: [
        {
          id: '1',
          author: {
            name: 'Dr. Priya Sharma',
            avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f',
            credentials: 'PhD in Ayurveda',
            experience: '12 years'
          },
          title: 'Morning Routine for Kapha Balance',
          activities: [
            { time: '06:00 AM', activity: 'Wake up and tongue scraping' },
            { time: '06:15 AM', activity: 'Drink warm water with lemon' },
            { time: '06:30 AM', activity: 'Dry brushing and warm oil massage' },
            { time: '07:00 AM', activity: 'Vigorous yoga or exercise' },
            { time: '08:00 AM', activity: 'Light breakfast with ginger tea' }
          ],
          likes: 89,
          comments: 23,
          readTime: '3 min read',
          tags: ['Morning Routine', 'Kapha', 'Detox'],
          createdAt: '2023-06-20'
        },
        {
          id: '2',
          author: {
            name: 'Dr. Anjali Deshpande',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
            credentials: 'BAMS, Women\'s Health',
            experience: '8 years'
          },
          title: 'Evening Wind-Down Routine',
          activities: [
            { time: '06:30 PM', activity: 'Gentle walk in nature' },
            { time: '07:30 PM', activity: 'Light dinner with digestive spices' },
            { time: '08:30 PM', activity: 'Meditation or journaling' },
            { time: '09:30 PM', activity: 'Warm milk with nutmeg' },
            { time: '10:00 PM', activity: 'Bedtime with digital detox' }
          ],
          likes: 76,
          comments: 18,
          readTime: '2 min read',
          tags: ['Evening', 'Sleep', 'Vata'],
          createdAt: '2023-08-15'
        },
        {
          id: '3',
          author: {
            name: 'Dr. Sanjay Gupta',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
            credentials: 'MD, Ayurvedic Cardiology',
            experience: '14 years'
          },
          title: 'Heart-Healthy Daily Routine',
          activities: [
            { time: '05:30 AM', activity: 'Wake up and practice pranayama' },
            { time: '06:30 AM', activity: 'Gentle yoga focusing on heart openers' },
            { time: '07:30 AM', activity: 'Breakfast with heart-healthy herbs' },
            { time: '12:00 PM', activity: 'Main meal with bitter greens' },
            { time: '05:00 PM', activity: 'Evening walk and relaxation' }
          ],
          likes: 112,
          comments: 34,
          readTime: '4 min read',
          tags: ['Heart Health', 'Pitta', 'Daily'],
          createdAt: '2023-05-05'
        }
      ],
      successStories: [
        {
          id: '1',
          author: {
            name: 'Rahul Mehta',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
          },
          title: 'Reversing PCOS with Ayurveda',
          content: 'After years of struggling with PCOS symptoms, irregular periods, and weight gain, I turned to Ayurveda. Within 6 months of following a Kapha-pacifying diet, taking Shatavari and Ashoka, and practicing yoga, my cycles regulated naturally and I lost 12 kg without extreme dieting.',
          image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352',
          likes: 215,
          comments: 78,
          readTime: '7 min read',
          tags: ['PCOS', 'Women Health', 'Success'],
          verification: { 
            verified: true,
            verifiedBy: [{
              name: 'Dr. Neha Patel',
              avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2',
              credentials: 'MD Ayurveda, Women\'s Health'
            }]
          },
          taggedDoctors: [
            {
              name: 'Dr. Priya Sharma',
              avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f',
              credentials: 'PhD in Ayurveda'
            }
          ],
          createdAt: '2023-04-10'
        },
        {
          id: '2',
          author: {
            name: 'Sunita Rao',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2'
          },
          title: 'Healing Chronic Digestive Issues',
          content: 'Years of IBS and bloating were resolved through Ayurvedic treatment. My practitioner identified my aggravated Pitta and prescribed a cooling diet, herbs like Guduchi and Musta, and stress management techniques. Within 3 months, my digestion completely transformed.',
          image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
          likes: 178,
          comments: 42,
          readTime: '6 min read',
          tags: ['Digestion', 'IBS', 'Pitta'],
          verification: { 
            verified: true,
            verifiedBy: [{
              name: 'Dr. Rajesh Verma',
              avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d',
              credentials: 'Panchakarma Specialist'
            }]
          },
          createdAt: '2023-07-18'
        },
        {
          id: '3',
          author: {
            name: 'Arjun Kapoor',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
          },
          title: 'Overcoming Anxiety Naturally',
          content: 'My anxiety was debilitating until I discovered Ayurveda. Through a Vata-balancing routine, daily Abhyanga, and herbs like Brahmi and Jatamansi, I gradually reduced my symptoms. After 4 months, I was able to stop medication under medical supervision.',
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
          likes: 203,
          comments: 65,
          readTime: '5 min read',
          tags: ['Anxiety', 'Mental Health', 'Vata'],
          verification: { 
            verified: true,
            verifiedBy: [{
              name: 'Dr. Ayush Kumar',
              avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d',
              credentials: 'BAMS, MD Ayurveda'
            }]
          },
          createdAt: '2023-03-05'
        }
      ]
    });
    
    setIsLoading(false);
  };

  return (
<div className="min-h-screen w-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 mb-3">
            Ayurvedic AI Search
          </h1>
          <p className="text-lg text-gray-600">
            Ask any health-related question and get personalized Ayurvedic insights
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about symptoms, remedies, routines..."
              className="h-14 text-lg px-6 py-4 shadow-lg border-2 border-gray-200 focus:border-green-500 rounded-xl"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              disabled={isLoading || !query.trim()}
              className="h-14 px-8 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </>
              )}
            </Button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">General Posts</h2>
                <div className="grid gap-6">
                  {[1, 2, 3].map((i) => (
                    <GeneralPostCardSkeleton key={i} />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Routines</h2>
                <div className="grid gap-6">
                  {[1, 2, 3].map((i) => (
                    <RoutinePostCardSkeleton key={i} />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Success Stories</h2>
                <div className="grid gap-6">
                  {[1, 2, 3].map((i) => (
                    <SuccessStoryCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {results && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-12"
          >
            {results.generalPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Recommended Posts</h2>
                <div className="grid gap-6">
                  {results.generalPosts.map((post) => (
                    <GeneralPostCard
                      key={post.id}
                      post={post}
                      liked={false}
                      saved={false}
                      onLike={() => {}}
                      onSave={() => {}}
                    />
                  ))}
                </div>
              </div>
            )}

            {results.routines.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Suggested Routines</h2>
                <div className="grid gap-6">
                  {results.routines.map((routine) => (
                    <RoutinePostCard
                      key={routine.id}
                      post={routine}
                      liked={false}
                      saved={false}
                      onLike={() => {}}
                      onSave={() => {}}
                    />
                  ))}
                </div>
              </div>
            )}

            {results.successStories.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Inspiring Stories</h2>
                <div className="grid gap-6">
                  {results.successStories.map((story) => (
                    <SuccessStoryCard
                      key={story.id}
                      post={story}
                      liked={false}
                      saved={false}
                      onLike={() => {}}
                      onSave={() => {}}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AISearchPage;