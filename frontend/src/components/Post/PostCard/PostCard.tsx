import { FC, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Smile } from "lucide-react";
import PostCardProps from "./PostCard.types";
import { ScrollArea } from "@/components/ui/scroll-area";

const PostCard: FC<PostCardProps> = ({ post, handleMediaClick }) => {
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState<boolean>(false);
  const [comments, setComments] = useState<string[]>([]);

  const addComment = () => {
    if (comment.trim()) {
      setComments([...comments, comment]);
      setComment("");
    }
  };

  return (
    <Card className="mb-6 overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={post.profileData.profilePic} alt={post.profileData.name} />
            <AvatarFallback>{post.profileData?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{post.profileData.name}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-gray-700 dark:text-gray-300 text-sm mt-4">{post.content}</div>
        {post.images.length > 0 && (
          <img src={post.images[0]} alt="Post content" className="w-full h-64 object-contain rounded-md" onClick={() => handleMediaClick(post)} />
        )}
      </CardContent>
      <CardFooter className="flex flex-col pt-0">
        <div className="flex items-center justify-between w-full pb-3 border-b">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <span>{comments.length} {comments.length === 1 ? "comment" : "comments"}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="mt-2" onClick={() => setShowComments(!showComments)}>
          <MessageCircle size={18} /> <span>Comment</span>
        </Button>
        {showComments && (
          <div className="w-full pt-3 border-t">
            <ScrollArea className="h-[200px] mb-4 pr-4">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={index} className="flex items-start space-x-2 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-gray-100 p-2 rounded-md">
                      <p className="text-sm">{comment}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6 space-y-2">
                  <Smile className="h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </ScrollArea>
            <div className="flex items-start space-x-2 mt-3">
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[40px] flex-1 resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addComment();
                  }
                }}
              />
              <Button variant="outline" size="sm" className="ml-2" onClick={addComment} disabled={!comment.trim()}>
                Post
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;
