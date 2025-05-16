import { useState, useEffect, useRef } from "react";
import { 
  Button,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Chip
} from "@mui/material";
import { 
  Search as SearchIcon, 
  Mic as MicIcon, 
  MicOff as MicOffIcon 
} from "@mui/icons-material";
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
  const recognitionRef = useRef<any>(null);

  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);
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

  useEffect(() => {
    // Initialize speech recognition
    if (!('webkitSpeechRecognition' in window)) {
      setSpeechError("Your browser doesn't support speech recognition");
      setIsBrowserSupported(false);
      return;
    }

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setSpeechError(null);
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
    };

    recognitionRef.current.onerror = (event: any) => {
      setIsListening(false);
      setSpeechError(`Error occurred in recognition: ${event.error}`);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
    }
  }, [transcript]);

  const startListening = () => {
    try {
      setTranscript("");
      setSpeechError(null);
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (err) {
      setSpeechError("Could not start microphone. Please check permissions.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSearch = async () => {
    try {
      if (!query.trim()) return;

      setIsLoading(true);
      setResults(null);

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

      setResults(filteredResults);
    } catch (error: any) {
      handleAxiosError(error);
      if (error.status === 401) navigate("/auth");
      else if (error.status === 403) navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 100%)',
        py: 12,
        px: { xs: 2, sm: 3, md: 4 }
      }}
    >
      <Box sx={{ maxWidth: '1536px', mx: 'auto' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h3" 
            component="h1"
            sx={{
              textAlign: 'center',
              mb: 2,
              background: 'linear-gradient(90deg, #16a34a 0%, #2563eb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              fontSize: { xs: '2rem', sm: '2.5rem' }
            }}
          >
            Ayurvedic AI Search
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: 'center',
              color: 'text.secondary',
              fontSize: '1.125rem'
            }}
          >
            Ask any health-related question and get personalized Ayurvedic insights
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ marginBottom: '3rem' }}
        >
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              mb: 2
            }}
          >
            <TextField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about symptoms, remedies, routines..."
              onKeyDown={handleKeyDown}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '56px',
                  fontSize: '1.125rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  '& fieldset': {
                    borderWidth: '2px',
                    borderColor: 'grey.300'
                  },
                  '&:hover fieldset': {
                    borderColor: 'grey.400'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'success.main'
                  }
                }
              }}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                onClick={handleSearch}
                disabled={isLoading || !query.trim()}
                variant="contained"
                sx={{
                  height: '56px',
                  px: 4,
                  fontSize: '1.125rem',
                  background: 'linear-gradient(90deg, #16a34a 0%, #2563eb 100%)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #15803d 0%, #1e40af 100%)'
                  },
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
              >
                Search
              </Button>
              {isBrowserSupported && (
                <Button
                  onClick={toggleListening}
                  variant={isListening ? "contained" : "outlined"}
                  color={isListening ? "error" : "primary"}
                  sx={{
                    height: '56px',
                    px: 2,
                    fontSize: '1.125rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    borderWidth: '2px',
                    minWidth: 'auto'
                  }}
                  startIcon={isListening ? <MicOffIcon /> : <MicIcon />}
                >
                  {isListening ? 'Stop' : 'Speak'}
                </Button>
              )}
            </Box>
          </Box>
          
          {isListening && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Chip
                  icon={<Box sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    bgcolor: 'error.main',
                    animation: 'pulse 1.5s infinite',
                    '@keyframes pulse': {
                      '0%': { opacity: 1 },
                      '50%': { opacity: 0.5 },
                      '100%': { opacity: 1 }
                    }
                  }} />}
                  label="Listening..."
                  sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}
                />
              </Box>
            </motion.div>
          )}
          
          {speechError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Typography 
                color="error" 
                sx={{ textAlign: 'center', mt: 2 }}
              >
                {speechError}
              </Typography>
            </motion.div>
          )}
        </motion.div>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}
            >
              <div>
                <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>
                  General Posts
                </Typography>
                <Box sx={{ display: 'grid', gap: 3 }}>
                  {[1, 2, 3].map((i) => (
                    <GeneralPostCardSkeleton key={i} />
                  ))}
                </Box>
              </div>

              <div>
                <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>
                  Routines
                </Typography>
                <Box sx={{ display: 'grid', gap: 3 }}>
                  {[1, 2, 3].map((i) => (
                    <RoutinePostCardSkeleton key={i} />
                  ))}
                </Box>
              </div>

              <div>
                <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>
                  Success Stories
                </Typography>
                <Box sx={{ display: 'grid', gap: 3 }}>
                  {[1, 2, 3].map((i) => (
                    <SuccessStoryCardSkeleton key={i} />
                  ))}
                </Box>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {results && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}
          >
            {results.generalPosts.length > 0 && (
              <div>
                <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>
                  Recommended Posts
                </Typography>
                <Box sx={{ display: 'grid', gap: 3 }}>
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
                </Box>
              </div>
            )}

            {results.routines.length > 0 && (
              <div>
                <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>
                  Suggested Routines
                </Typography>
                <Box sx={{ display: 'grid', gap: 3 }}>
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
                </Box>
              </div>
            )}

            {results.successStories.length > 0 && (
              <div>
                <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>
                  Inspiring Stories
                </Typography>
                <Box sx={{ display: 'grid', gap: 3 }}>
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
                </Box>
              </div>
            )}
          </motion.div>
        )}
      </Box>
    </Box>
  );
};

export default AISearchPage;