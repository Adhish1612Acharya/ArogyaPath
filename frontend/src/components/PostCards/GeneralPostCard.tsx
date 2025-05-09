import {
  Favorite,
  ChatBubbleOutline,
  Share,
  Bookmark,
  MenuBook,
  AccessTime,
} from "@mui/icons-material";
import { Button, Avatar, Card, CardContent, CardActions, Chip, Typography, Popover } from "@mui/material";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { GeneralPostsType } from "@/pages/posts/GeneralPosts";
import { useState } from "react";

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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300 rounded-lg">
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <div 
              aria-owns={open ? 'mouse-over-popover' : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              <Avatar 
                className="h-10 w-10 sm:h-12 sm:w-12 cursor-pointer border-2 border-green-100"
                src={post.author.avatar}
                alt={post.author.name}
              >
                {post.author.name[0]}
              </Avatar>
            </div>
            
            <Popover
              id="mouse-over-popover"
              open={open}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              onClose={handlePopoverClose}
              disableRestoreFocus
              className="shadow-xl"
            >
              <div className="p-4 flex space-x-4 w-80">
                <Avatar className="h-12 w-12" src={post.author.avatar}>
                  {post.author.name[0]}
                </Avatar>
                <div className="space-y-1">
                  <Typography variant="subtitle1" className="font-semibold">
                    {post.author.name}
                  </Typography>
                </div>
              </div>
            </Popover>

            <div className="flex-1">
              <Typography variant="h6" className="font-semibold hover:text-green-600 transition-colors">
                {post.author.name}
              </Typography>
              <div className="flex flex-wrap items-center gap-2 text-gray-500">
                <span className="flex items-center gap-1 text-sm">
                  <AccessTime className="text-sm" />
                  {formatDistanceToNow(new Date(post.createdAt || ""), {
                    addSuffix: true,
                  })}
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1 text-sm">
                  <MenuBook className="text-sm" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>

          <Typography variant="h5" className="my-3 font-semibold hover:text-green-600 transition-colors">
            {post.title}
          </Typography>

          <Typography variant="body1" className="text-gray-600 mb-4">
            {post.content}
          </Typography>

          {post.images && (
            <img
              src={post.images[0]}
              alt={post.title}
              className="rounded-lg w-full h-48 sm:h-64 object-cover hover:opacity-90 transition-opacity mb-4"
            />
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                className="bg-green-50 text-green-700 hover:bg-green-100 transition-colors cursor-pointer"
                size="small"
              />
            ))}
          </div>
        </CardContent>

        <CardActions className="bg-gray-50 px-4 py-3 border-t">
          <div className="flex justify-between items-center w-full">
            <div className="flex space-x-4 sm:space-x-6">
              <Button
                size="small"
                onClick={onLike}
                className={`h-8 px-2 hover:text-red-500 ${
                  liked ? "text-red-500" : "text-gray-500"
                }`}
                startIcon={
                  <Favorite className={liked ? "text-inherit" : "text-gray-500"} />
                }
              >
                <span className="text-xs sm:text-sm">
                  {post.likes + (liked ? 1 : 0)}
                </span>
              </Button>
              <Button
                size="small"
                className="h-8 px-2 text-gray-500 hover:text-blue-500"
                startIcon={<ChatBubbleOutline />}
              >
                <span className="text-xs sm:text-sm">{post.comments}</span>
              </Button>
              <Button
                size="small"
                className="h-8 px-2 text-gray-500 hover:text-green-500"
                startIcon={<Share />}
              >
                <span className="text-xs sm:text-sm">Share</span>
              </Button>
            </div>
            <Button
              size="small"
              onClick={onSave}
              className={`h-8 w-8 p-0 hover:text-yellow-500 ${
                saved ? "text-yellow-500" : "text-gray-500"
              }`}
            >
              <Bookmark className={saved ? "text-inherit" : "text-gray-500"} />
            </Button>
          </div>
        </CardActions>
      </Card>
    </motion.div>
  );
}