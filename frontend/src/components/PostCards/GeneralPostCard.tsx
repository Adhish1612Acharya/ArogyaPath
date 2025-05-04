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
import { GeneralPostsType } from "@/pages/posts/GeneralPosts";

interface GeneralPostCardProps {
  post: GeneralPostsType;
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
}

export function GeneralPostCard({
  post,
  liked,
  saved,
  onLike,
  onSave,
}: GeneralPostCardProps) {
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
                  {/* <p className="text-xs text-gray-600">
                    {post.author.credentials}
                  </p>
                  <p className="text-xs text-gray-600">
                    {post.author.experience}
                  </p> */}
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

        {post.images && (
          <img
            src={post.images[0]}
            alt={post.title}
            className="rounded-lg w-full h-48 sm:h-64 object-cover hover:opacity-90 transition-opacity mb-4"
          />
        )}

        {/* {post.verification && (
          <div className="mb-4">
            {post.verification.verified ? (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full w-max">
                <CheckCircle className="h-4 w-4" />
                <span>
                  Verified by {post.verification.verifiedBy?.length} doctors
                </span>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button className="text-xs text-green-700 underline">
                      View
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64 shadow-lg">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Verified by:</h4>
                      {post.verification.verifiedBy?.map((doctor, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={doctor.avatar} />
                            <AvatarFallback>{doctor.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-medium">{doctor.name}</p>
                            <p className="text-xs text-gray-500">
                              {doctor.credentials}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-full w-max">
                <span>Under Verification</span>
              </div>
            )}
          </div>
        )} */}

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
