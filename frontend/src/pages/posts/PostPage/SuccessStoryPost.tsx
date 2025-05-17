import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { SuccessStoryCard } from "@/components/PostCards/SuccessStoryCard/SuccessStoryCard";
import { SuccessStoryCardSkeleton } from "@/components/PostCards/PostCardSkeletons";
import usePost from "@/hooks/usePost/usePost";
import { SuccessStoryType } from "../SuccessStoryPosts";

// interface Author {
//   name: string;
//   avatar: string;
// }

// interface Doctor {
//   name: string;
//   avatar: string;
//   credentials: string;
// }

// interface Verification {
//   verified: boolean;
//   verifiedBy?: Doctor[];
// }

// interface SuccessStoryPost {
//   id: string;
//   author: Author;
//   title: string;
//   content: string;
//   image?: string;
//   likes: number;
//   comments: number;
//   readTime: string;
//   tags: string[];
//   verification: Verification;
//   taggedDoctors?: Doctor[];
//   createdAt: string;
//   condition: string;
//   duration: string;
//   improvements: string[];
// }

export function SuccessStoryPost() {
  const { getSuccessStoryById } = useGetPost();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<SuccessStoryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      const ssData = await getSuccessStoryById(id);

      setPost(ssData.successStory);
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen w-full bg-gray-50">
        <div className="w-full w-screen max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <SuccessStoryCardSkeleton />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center w-screen justify-center min-h-screen w-full bg-gray-50">
        Post not found
      </div>
    );
  }

  return (
    <div className="w-screen w-full bg-gray-50">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" className="hover:bg-green-50">
            <Link to="/success-stories" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to all stories
            </Link>
          </Button>
        </div>

        <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <SuccessStoryCard
            post={post}
            liked={liked}
            saved={saved}
            onLike={() => setLiked(!liked)}
            onSave={() => setSaved(!saved)}
            setPost={setPost}
            index={1}
          />
        </div>
      </div>
    </div>
  );
}
