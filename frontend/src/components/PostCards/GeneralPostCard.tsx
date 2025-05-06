import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  BookOpen,
  Clock,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { GeneralPostsType } from "@/pages/posts/GeneralPosts";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface GeneralPostCardProps {
  post: GeneralPostsType;
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
  onComment: (comment: string) => void;
  onReply: (commentId: string, reply: string) => void;
}

export function GeneralPostCard({
  post,
  liked,
  saved,
  onLike,
  onSave,
  onComment,
  onReply,
}: GeneralPostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(newComment);
      setNewComment("");
    }
  };

  const handleReplySubmit = (commentId: string) => {
    if (replyText.trim()) {
      onReply(commentId, replyText);
      setReplyText("");
      setReplyingTo(null);
    }
  };

  const renderImageGallery = () => {
    if (!post.images || post.images.length === 0) return null;

    if (post.images.length === 1) {
      return (
        <img
          src={post.images[0]}
          alt={post.title}
          className="rounded-lg w-full h-48 sm:h-64 object-cover hover:opacity-90 transition-opacity mb-4"
        />
      );
    }

    return (
      <div className={`grid gap-2 mb-4 rounded-lg overflow-hidden ${
        post.images.length === 2 ? 'grid-cols-2' : 
        post.images.length === 3 ? 'grid-cols-2' : 
        'grid-cols-2 grid-rows-2'
      }`} style={{
        aspectRatio: post.images.length > 2 ? '16/9' : '1/1'
      }}>
        {post.images.slice(0, 4).map((image, index) => (
          <div key={index} className={`relative ${
            index === 0 && post.images.length > 2 ? 'row-span-2' : ''
          }`}>
            <img
              src={image}
              alt={`${post.title} ${index + 1}`}
              className="w-full h-full object-cover"
              style={{
                height: post.images.length === 3 && index === 2 ? '100%' : '100%'
              }}
            />
            {index === 3 && post.images.length > 4 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Plus className="h-8 w-8 text-white" />
                <span className="text-white text-lg ml-1">
                  +{post.images.length - 4}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0 shadow-sm bg-white rounded-lg mb-6"
    >
      <div className="p-4">
        <div className="flex items-start space-x-4">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 cursor-pointer border-2 border-green-100">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 shadow-xl">
              <div className="flex space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">{post.author.name}</h4>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold hover:text-green-600 transition-colors">
              {post.author.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />{" "}
                {formatDistanceToNow(new Date(post.createdAt || ""), {
                  addSuffix: true,
                })}
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-semibold my-3 hover:text-green-600 transition-colors">
          {post.title}
        </h3>

        <p className="text-gray-600 mb-4 text-sm sm:text-base">
          {post.content}
        </p>

        {renderImageGallery()}

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 bg-green-50 text-green-700 rounded-full text-xs sm:text-sm hover:bg-green-100 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t bg-gray-50 px-4 py-3">
        <div className="flex justify-between items-center w-full">
          <div className="flex space-x-4 sm:space-x-6 text-gray-500">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLike}
              className={`h-8 px-2 hover:text-red-500 ${
                liked ? "text-red-500" : ""
              }`}
            >
              <Heart
                className="h-4 w-4 mr-1.5"
                fill={liked ? "currentColor" : "none"}
              />
              <span className="text-xs sm:text-sm">
                {post.likes + (liked ? 1 : 0)}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 hover:text-blue-500"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4 mr-1.5" />
              <span className="text-xs sm:text-sm">{post.comments}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 hover:text-green-500"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    text: post.content.substring(0, 100) + '...',
                    url: window.location.href,
                  }).catch(console.error);
                } else {
                  alert('Share this post: ' + window.location.href);
                }
              }}
            >
              <Share2 className="h-4 w-4 mr-1.5" />
              <span className="text-xs sm:text-sm">Share</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            className={`h-8 w-8 p-0 hover:text-yellow-500 ${
              saved ? "text-yellow-500" : ""
            }`}
          >
            <Bookmark
              className={`h-4 w-4 transition-transform ${
                saved ? "fill-current" : ""
              }`}
            />
          </Button>
        </div>
      </div>

      {showComments && (
        <div className="border-t bg-gray-50 p-4">
          <div className="space-y-4">
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1"
                rows={1}
              />
              <Button type="submit" size="sm">
                Post
              </Button>
            </form>

            <div className="space-y-4">
              {post.commentsList?.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {comment.author.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.text}</p>
                    </div>
                    <div className="mt-1 ml-3">
                      <Button
                        variant="ghost"
                        size="xs"
                        className="text-xs text-gray-500 hover:text-blue-500"
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      >
                        Reply
                      </Button>
                    </div>

                    {replyingTo === comment.id && (
                      <div className="mt-2 flex gap-2">
                        <Input
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="flex-1 text-xs h-8"
                        />
                        <Button
                          size="sm"
                          className="h-8"
                          onClick={() => handleReplySubmit(comment.id)}
                        >
                          Post
                        </Button>
                      </div>
                    )}

                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-2 space-y-2 pl-4 border-l-2 border-gray-200">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={reply.author.avatar} />
                              <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="bg-gray-100 rounded-lg p-2 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-xs">
                                  {reply.author.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatDistanceToNow(new Date(reply.createdAt), {
                                    addSuffix: true,
                                  })}
                                </span>
                              </div>
                              <p className="text-xs mt-1">{reply.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}