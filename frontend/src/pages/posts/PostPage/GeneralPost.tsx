import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import { GeneralPostCardSkeleton } from "@/components/PostCards/PostCardSkeletons";
import { GeneralPostsType } from "../GeneralPosts";
import GeneralPostCard from "@/components/PostCards/GeneralPostCard/GeneralPostCard";

export function GeneralPost() {
  const { getGPostById } = useGetPost();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<GeneralPostsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      const ssData = await getGPostById(id);

      setPost(ssData.post);
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center w-screen justify-center min-h-screen w-full bg-gray-50">
        <div className="w-full w-screen max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <GeneralPostCardSkeleton />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">
        Post not found
      </div>
    );
  }

  return (
    <div className="w-screen  w-full bg-gray-50">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" className="hover:bg-green-50">
            <Link to="/gposts" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to all posts
            </Link>
          </Button>
        </div>

        <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <GeneralPostCard
            post={post}
            liked={liked}
            saved={saved}
            onLike={() => setLiked(!liked)}
            onSave={() => setSaved(!saved)}
          />
        </div>
      </div>
    </div>
  );
}
