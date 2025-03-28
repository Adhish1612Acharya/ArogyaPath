import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  X,
  Image as ImageIcon,
  Video,
  Clock,
  Trash2,
} from 'lucide-react';

interface RoutineActivity {
  time: string;
  activity: string;
}

export function CreatePostPage() {
  const [postType, setPostType] = useState<'general' | 'routine'>('general');
  const [routineActivities, setRoutineActivities] = useState<RoutineActivity[]>([
    { time: '', activity: '' },
  ]);
  
  const addActivity = () => {
    setRoutineActivities([...routineActivities, { time: '', activity: '' }]);
  };

  const removeActivity = (index: number) => {
    setRoutineActivities(routineActivities.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar userType="expert" />

      <main className="container mx-auto px-4 py-24">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Create New Post
            </CardTitle>
            <CardDescription className="text-center">
              Share your knowledge and expertise with the community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Post Type</Label>
              <Select value={postType} onValueChange={(value) => setPostType(value as 'general' | 'routine')}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select post type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Post</SelectItem>
                  <SelectItem value="routine">Routine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="Enter post title" className="bg-white focus-visible:ring-green-500" />
            </div>

            {postType === 'general' ? (
              <>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea placeholder="Share your thoughts..." className="min-h-[200px] bg-white focus-visible:ring-green-500" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline" className="w-full hover:bg-green-50 hover:text-green-700">
                    <ImageIcon className="mr-2 h-4 w-4" /> Add Image
                  </Button>
                  <Button variant="outline" className="w-full hover:bg-green-50 hover:text-green-700">
                    <Video className="mr-2 h-4 w-4" /> Add Video
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {routineActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 relative p-4 border rounded-lg bg-white hover:shadow-md transition-shadow group">
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Time</Label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              type="time"
                              value={activity.time}
                              onChange={(e) => {
                                const newActivities = [...routineActivities];
                                newActivities[index].time = e.target.value;
                                setRoutineActivities(newActivities);
                              }}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Activity</Label>
                          <Input
                            value={activity.activity}
                            onChange={(e) => {
                              const newActivities = [...routineActivities];
                              newActivities[index].activity = e.target.value;
                              setRoutineActivities(newActivities);
                            }}
                            placeholder="Describe the activity"
                          />
                        </div>
                      </div>
                    </div>
                    {routineActivities.length > 1 && (
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 hover:text-red-500" onClick={() => removeActivity(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" className="w-full hover:bg-green-50 hover:text-green-700" onClick={addActivity}>
                  <Plus className="mr-2 h-4 w-4" /> Add Activity
                </Button>
              </div>
            )}

            <Button className="w-full bg-green-600 hover:bg-green-700">Publish Post</Button>
          </CardContent>
        </Card>
      </main>

      <Footer userType="expert" />
    </div>
  );
}
