import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  BookOpen,
  Clock,
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

interface Author {
  name: string;
  avatar: string;
  // credentials: string;
  // experience: string;
}

interface Activity {
  time: string;
  content: string;
}

interface RoutinePostCardProps {
  post: {
    id: string;
    author: Author;
    title: string;
    content: string;
    thumbnail: string;
    activities: Activity[];
    likes: number;
    comments: number;
    readTime: string;
    tags: string[];
    createdAt: Date;
  };
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
}

export function RoutinePostCard({
  post,
  liked,
  saved,
  onLike,
  onSave,
}: RoutinePostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0 shadow-sm bg-white rounded-lg"
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
                  {/* <p className="text-xs text-gray-600">{post.author.credentials}</p>
                  <p className="text-xs text-gray-600">{post.author.experience}</p> */}
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

        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt={post.title}
            className="rounded-lg w-full h-48 sm:h-64 object-cover hover:opacity-90 transition-opacity mb-4"
          />
        )}

        <div className="space-y-4 mt-4">
          {post.activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 relative group"
            >
              <div className="flex flex-col items-center pt-1">
                <div className="h-3 w-3 rounded-full bg-green-500 group-hover:bg-green-600 transition-colors" />
                {index < post.activities.length - 1 && (
                  <div className="h-full w-0.5 bg-green-200 group-hover:bg-green-300 transition-colors" />
                )}
              </div>
              <div className="flex-1 p-3 rounded-lg hover:bg-green-50 transition-colors">
                <p className="font-medium text-sm text-green-700">
                  {activity.time}
                </p>
                <p className="text-gray-600 text-sm">{activity.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
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
            >
              <MessageCircle className="h-4 w-4 mr-1.5" />
              <span className="text-xs sm:text-sm">{post.comments}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 hover:text-green-500"
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
    </motion.div>
  );
}
