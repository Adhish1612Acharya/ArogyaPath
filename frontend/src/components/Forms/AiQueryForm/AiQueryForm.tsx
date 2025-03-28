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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface Tag {
  id: string;
  text: string;
}

export function CreatePostPage() {
  const [postType, setPostType] = useState<'general' | 'routine'>('general');
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.find(tag => tag.text === tagInput.trim())) {
        setTags([...tags, { id: Date.now().toString(), text: tagInput.trim() }]);
      }
      setTagInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
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

            <Button type="button" className="w-full bg-green-600 hover:bg-green-700">Publish Post</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
