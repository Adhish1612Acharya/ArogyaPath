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

export function CreateUserPostPage() {
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

  const handleFileChange = (file: File | null, type: 'image' | 'video' | 'document') => {
    if (type === 'image') setImage(file);
    if (type === 'video') setVideo(file);
    if (type === 'document') setDocument(file);
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
                
                <div className="space-y-2">
                  <Label>Add Tags</Label>
                  <Input
                    placeholder="Press Enter to add tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="bg-white focus-visible:ring-green-500"
                  />
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag.id} className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                        {tag.text} <button onClick={() => setTags(tags.filter(t => t.id !== tag.id))} className="ml-1 text-red-500">&times;</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <label className="cursor-pointer">
                    <ImageIcon className="mr-2 h-4 w-4" /> Add Image
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'image')} />
                  </label>
                  <label className="cursor-pointer">
                    <Video className="mr-2 h-4 w-4" /> Add Video
                    <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'video')} />
                  </label>
                  <label className="cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" /> Add Document
                    <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'document')} />
                  </label>
                </div>
                {image && <img src={URL.createObjectURL(image)} alt="Uploaded" className="mt-2 w-full h-auto rounded-lg" />}
                {video && <video src={URL.createObjectURL(video)} controls className="mt-2 w-full rounded-lg" />}
                {document && <p className="mt-2 text-sm text-gray-700">Uploaded Document: {document.name}</p>}
              </>
            ) : null}

            <Button type="button" className="w-full bg-green-600 hover:bg-green-700">Publish Post</Button>
          </CardContent>
        </Card>
      </main>

      <Footer userType="expert" />
    </div>
  );
}