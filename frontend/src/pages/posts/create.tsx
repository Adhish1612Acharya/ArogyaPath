import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  X,
  Image as ImageIcon,
  Video,
  FileText,
  Trash2,
  Clock,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/layout/footer';

interface Tag {
  id: string;
  text: string;
}

interface RoutineActivity {
  id: string;
  time: string;
  activity: string;
}

export function CreatePostPage() {
  const [postType, setPostType] = useState<'general' | 'routine'>('general');
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [document, setDocument] = useState<File | null>(null);
  const [routineActivities, setRoutineActivities] = useState<RoutineActivity[]>([]);

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.find(tag => tag.text === tagInput.trim())) {
        setTags([...tags, { id: Date.now().toString(), text: tagInput.trim() }]);
      }
      setTagInput('');
    }
  };

  const handleDragStart = (index: number) => {
    setRoutineActivities((prev) => {
      const newActivities = [...prev];
      const [draggedActivity] = newActivities.splice(index, 1);
      newActivities.push(draggedActivity);
      return newActivities;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeActivity = (index: number) => {
    setRoutineActivities(routineActivities.filter((_, i) => i !== index));
  };

  const addActivity = () => {
    setRoutineActivities([...routineActivities, { id: Date.now().toString(), time: '', activity: '' }]);
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
              <Select value={postType} onValueChange={(value:any) => setPostType(value as 'general' | 'routine')}>
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
                  <Button asChild>
                    <label>
                      <ImageIcon className="mr-2 h-4 w-4" /> Add Image
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files?.[0] || null)} />
                    </label>
                  </Button>
                  <Button asChild>
                    <label>
                      <Video className="mr-2 h-4 w-4" /> Add Video
                      <input type="file" accept="video/*" className="hidden" onChange={(e) => setVideo(e.target.files?.[0] || null)} />
                    </label>
                  </Button>
                  <Button asChild>
                    <label>
                      <FileText className="mr-2 h-4 w-4" /> Add Document
                      <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={(e) => setDocument(e.target.files?.[0] || null)} />
                    </label>
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {routineActivities.map((activity, index) => (
                  <div key={activity.id} draggable onDragStart={() => handleDragStart(index)} onDragOver={handleDragOver} className="flex items-start space-x-4 relative p-4 border rounded-lg bg-white hover:shadow-md transition-shadow group">
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Time</Label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input type="time" value={activity.time} onChange={(e) => {
                              const newActivities = [...routineActivities];
                              newActivities[index].time = e.target.value;
                              setRoutineActivities(newActivities);
                            }} className="pl-10" />
                          </div>
                        </div>
                        <div>
                          <Label>Activity</Label>
                          <Input value={activity.activity} onChange={(e) => {
                            const newActivities = [...routineActivities];
                            newActivities[index].activity = e.target.value;
                            setRoutineActivities(newActivities);
                          }} placeholder="Describe the activity" />
                        </div>
                      </div>
                    </div>
                    {routineActivities.length > 1 && (
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500" onClick={() => removeActivity(index)}>
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

            <Button type="button" className="w-full bg-green-600 hover:bg-green-700">Publish Post</Button>
          </CardContent>
        </Card>
      </main>

      <Footer userType="expert" />
    </div>
  );
}