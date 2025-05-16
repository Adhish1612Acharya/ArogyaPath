import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RoutinePostCard } from "@/components/PostCards/RoutinePostCard";
import { SuccessStoryCard } from "@/components/PostCards/SuccessStoryCard";
import {
  GeneralPostCardSkeleton,
  RoutinePostCardSkeleton,
  SuccessStoryCardSkeleton,
} from "@/components/PostCards/PostCardSkeletons";
import useApi from "@/hooks/useApi/useApi";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { useNavigate } from "react-router-dom";
import { CategoryKeyMap, PostType } from "./AiQuery.types";
import GeneralPostCard from "@/components/PostCards/GeneralPostCard/GeneralPostCard";

const AISearchPage = () => {
  const { get } = useApi();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    generalPosts: any[];
    routines: any[];
    successStories: any[];
  } | null>(null);
  const [allPosts, setAllPosts] = useState<{
    generalPosts: any[];
    routines: any[];
    successStories: any[];
  } | null>(null);

  const handleSearch = async () => {
    try {
      if (!query.trim()) return;

      setIsLoading(true);
      setResults(null);

      // STEP 3: Filter matching posts from original allPosts
      const filteredResults: {
        generalPosts: any[];
        routines: any[];
        successStories: any[];
      } = {
        generalPosts: [],
        routines: [],
        successStories: [],
      };

      const aiResponse = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/ai/search`,
        { params: { prompt: query } }
      );
      console.log("AI Response : ", aiResponse);
      aiResponse.posts.forEach(
        ({ data, type }: { data: any; type: PostType }) => {
          const categoryKeyMap: CategoryKeyMap = {
            post: "generalPosts",
            routine: "routines",
            successstory: "successStories",
          };

          const category = categoryKeyMap[type];

          const matchedPost = allPosts?.[category]?.find(
            (post) =>
              post._id?.toString() === data._id ||
              post.id?.toString() === data._id
          );

          if (matchedPost) {
            filteredResults[category].push(matchedPost);
          }
        }
      );

      console.log("Filtered Results : ", filteredResults);

      setResults(filteredResults);
    } catch (error: any) {
      handleAxiosError(error);
      if (error.status === 401) navigate("/auth");
      else if (error.status === 403) navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 mb-3">
            Ayurvedic AI Search
          </h1>
          <p className="text-lg text-gray-600">
            Ask any health-related question and get personalized Ayurvedic
            insights
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about symptoms, remedies, routines..."
              className="h-14 text-lg px-6 py-4 shadow-lg border-2 border-gray-200 focus:border-green-500 rounded-xl"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              disabled={isLoading || !query.trim()}
              className="h-14 px-8 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </>
              )}
            </Button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  General Posts
                </h2>
                <div className="grid gap-6">
                  {[1, 2, 3].map((i) => (
                    <GeneralPostCardSkeleton key={i} />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Routines
                </h2>
                <div className="grid gap-6">
                  {[1, 2, 3].map((i) => (
                    <RoutinePostCardSkeleton key={i} />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Success Stories
                </h2>
                <div className="grid gap-6">
                  {[1, 2, 3].map((i) => (
                    <SuccessStoryCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {results && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-12"
          >
            {results.generalPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Recommended Posts
                </h2>
                <div className="grid gap-6">
                  {results.generalPosts.map((post) => (
                    <GeneralPostCard
                      key={post.id}
                      post={post}
                      liked={false}
                      saved={false}
                      onLike={() => {}}
                      onSave={() => {}}
                    />
                  ))}
                </div>
              </div>
            )}

            {results.routines.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Suggested Routines
                </h2>
                <div className="grid gap-6">
                  {results.routines.map((routine) => (
                    <RoutinePostCard
                      key={routine.id}
                      post={routine}
                      liked={false}
                      saved={false}
                      onLike={() => {}}
                      onSave={() => {}}
                    />
                  ))}
                </div>
              </div>
            )}

            {results.successStories.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Inspiring Stories
                </h2>
                <div className="grid gap-6">
                  {results.successStories.map((story, index) => (
                    <SuccessStoryCard
                      key={story.id}
                      post={story}
                      liked={false}
                      saved={false}
                      onLike={() => {}}
                      onSave={() => {}}
                      setPost={index}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AISearchPage;
