import { useState, useEffect, useRef } from "react";
import {
  Button,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

import {
  GeneralPostCardSkeleton,
  RoutinePostCardSkeleton,
  SuccessStoryCardSkeleton,
} from "@/components/PostCards/PostCardSkeletons";
import { useNavigate } from "react-router-dom";
import GeneralPostCard from "@/components/PostCards/GeneralPostCard/GeneralPostCard";
import useAiSearch from "@/hooks/useAiSearch/useAiSearch";
import RoutinePostCard from "@/components/PostCards/RoutinePostCard/RoutinePostCard";
import SuccessStoryPostCard from "@/components/PostCards/SuccessStoryPostCard/SuccessStoryPostCard";
import MediaViewerDialog from "@/components/MediaViewerDialog/MediaViewerDialog";
import { UserOrExpertDetailsType } from "@/types";
import {
  VerifiersDialog,
  InvalidDialog,
} from "@/components/PostCards/SuccessStoryPostCard/Sections/VerificationDialogs";

const AISearchPage = () => {
  const { searchWithAi } = useAiSearch();
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);

  const [userId, setUserId] = useState<string>("");
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

  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [selectedMediaImageIndex, setSelectedMediaImageIndex] = useState<
    number | null
  >(null);
  const [mediaDialogImages, setMediaDialogImages] = useState<string[]>([]);

  // Dialog state for success story verification
  const [verifiersDialogOpen, setVerifiersDialogOpen] = useState(false);
  const [verifiersDialogData, setVerifiersDialogData] = useState<any[]>([]);
  const [verifiersDialogPostTitle, setVerifiersDialogPostTitle] = useState("");
  const [invalidDialogOpen, setInvalidDialogOpen] = useState(false);
  const [invalidReason, setInvalidReason] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);

  useEffect(() => {
    // Initialize speech recognition
    if (!("webkitSpeechRecognition" in window)) {
      setSpeechError("Your browser doesn't support speech recognition");
      setIsBrowserSupported(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || window.webkitSpeechRecognition;
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
      console.error(err);
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

      const results = await searchWithAi(query);

      setResults(results.filteredPosts);
      setUserId(results.userId);
    } catch (error: any) {
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

  const openMediaViewer = (mediaIndex: number, images: string[]) => {
    setSelectedMediaImageIndex(mediaIndex);
    setMediaDialogImages(images);
    setOpenMediaDialog(true);
  };

  const closeMediaViewer = () => {
    setSelectedMediaImageIndex(null);
    setMediaDialogImages([]);
    setOpenMediaDialog(false);
  };

  // const handleNextImage = () => {
  //   if (mediaDialogImages.length > 0) {
  //     setSelectedMediaImageIndex(
  //       (prev) => (prev ? prev + 1 : 0) % mediaDialogImages.length
  //     );
  //   }
  // };

  // const handlePrevImage = () => {
  //   if (mediaDialogImages.length > 0) {
  //     setSelectedMediaImageIndex(
  //       (prev) =>
  //         (prev ? prev - 1 + mediaDialogImages.length : 0) %
  //         mediaDialogImages.length
  //     );
  //   }
  // };

  const addVerifiedExpert = (
    postId: string,
    expert: UserOrExpertDetailsType
  ) => {
    setResults((prev) => {
      if (!prev) return prev;

      const updatedSuccessStories = prev.successStories.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            verified: [...post.verified, expert],
          };
        }
        return post;
      });

      return {
        ...prev,
        successStories: updatedSuccessStories,
      };
    });
  };

  // Handler to open verifiers dialog
  const handleVerifiersDialogOpen = (verifiers: any[], postTitle: string) => {
    setVerifiersDialogData(verifiers);
    setVerifiersDialogPostTitle(postTitle);
    setVerifiersDialogOpen(true);
  };

  // Handler to open invalid dialog
  const handleInvalidDialogOpen = (_postId: string) => {
    setInvalidDialogOpen(true);
  };

  // Handler to confirm invalid (should be implemented to call API)
  const confirmInvalid = async () => {
    if (!invalidReason.trim()) return;
    setVerificationLoading(true);
    try {
      // You may want to call verifySuccessStory here if needed
      setInvalidDialogOpen(false);
      setInvalidReason("");
    } finally {
      setVerificationLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 100%)",
        py: 12,
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: "1536px", mx: "auto" }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              textAlign: "center",
              mb: 2,
              background: "linear-gradient(90deg, #16a34a 0%, #2563eb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
              fontSize: { xs: "2rem", sm: "2.5rem" },
            }}
          >
            Ayurvedic AI Search
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: "text.secondary",
              fontSize: "1.125rem",
            }}
          >
            Ask any health-related question and get personalized Ayurvedic
            insights
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ marginBottom: "3rem" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 2,
            }}
          >
            <TextField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about symptoms, remedies, routines..."
              onKeyDown={handleKeyDown}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "56px",
                  fontSize: "1.125rem",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  "& fieldset": {
                    borderWidth: "2px",
                    borderColor: "grey.300",
                  },
                  "&:hover fieldset": {
                    borderColor: "grey.400",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "success.main",
                  },
                },
              }}
              fullWidth
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                onClick={handleSearch}
                disabled={isLoading || !query.trim()}
                variant="contained"
                sx={{
                  height: "56px",
                  px: 4,
                  fontSize: "1.125rem",
                  background:
                    "linear-gradient(90deg, #16a34a 0%, #2563eb 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #15803d 0%, #1e40af 100%)",
                  },
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SearchIcon />
                  )
                }
              >
                Search
              </Button>
              {isBrowserSupported && (
                <Button
                  onClick={toggleListening}
                  variant={isListening ? "contained" : "outlined"}
                  color={isListening ? "error" : "primary"}
                  sx={{
                    height: "56px",
                    px: 2,
                    fontSize: "1.125rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    borderWidth: "2px",
                    minWidth: "auto",
                  }}
                  startIcon={isListening ? <MicOffIcon /> : <MicIcon />}
                >
                  {isListening ? "Stop" : "Speak"}
                </Button>
              )}
            </Box>
          </Box>

          {isListening && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Chip
                  icon={
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "error.main",
                        animation: "pulse 1.5s infinite",
                        "@keyframes pulse": {
                          "0%": { opacity: 1 },
                          "50%": { opacity: 0.5 },
                          "100%": { opacity: 1 },
                        },
                      }}
                    />
                  }
                  label="Listening..."
                  sx={{ bgcolor: "primary.light", color: "primary.dark" }}
                />
              </Box>
            </motion.div>
          )}

          {speechError && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
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
              style={{ display: "flex", flexDirection: "column", gap: "3rem" }}
            >
              <div>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ mb: 3, fontWeight: "bold", color: "text.primary" }}
                >
                  General Posts
                </Typography>
                <Box sx={{ display: "grid", gap: 3 }}>
                  {[1, 2, 3].map((i) => (
                    <GeneralPostCardSkeleton key={i} />
                  ))}
                </Box>
              </div>

              <div>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ mb: 3, fontWeight: "bold", color: "text.primary" }}
                >
                  Routines
                </Typography>
                <Box sx={{ display: "grid", gap: 3 }}>
                  {[1, 2, 3].map((i) => (
                    <RoutinePostCardSkeleton key={i} />
                  ))}
                </Box>
              </div>

              <div>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ mb: 3, fontWeight: "bold", color: "text.primary" }}
                >
                  Success Stories
                </Typography>
                <Box sx={{ display: "grid", gap: 3 }}>
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
            style={{ display: "flex", flexDirection: "column", gap: "3rem" }}
          >
            {results.generalPosts.length > 0 && (
              <div>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ mb: 3, fontWeight: "bold", color: "text.primary" }}
                >
                  Recommended Posts
                </Typography>
                {results.generalPosts.length > 0 ? (
                  <Box sx={{ display: "grid", gap: 3 }}>
                    {results.generalPosts.map((post) => (
                      <GeneralPostCard
                        key={post._id}
                        post={post}
                        isLiked={Math.random() < 0.5}
                        isSaved={Math.random() < 0.5}
                        currentUserId={userId}
                        onMediaClick={openMediaViewer}
                        onDelete={() => {}}
                        onEdit={() => {}}
                      />
                    ))}
                  </Box>
                ) : (
                  <>
                    <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                      No Posts found
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary", mb: 3 }}
                    >
                      Try adjusting your search or filters to find what you're
                      looking for.
                    </Typography>
                  </>
                )}
              </div>
            )}

            {results.routines.length > 0 && (
              <div>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ mb: 3, fontWeight: "bold", color: "text.primary" }}
                >
                  Suggested Routines
                </Typography>
                {results.routines.length > 0 ? (
                  <Box sx={{ display: "grid", gap: 3 }}>
                    {results.routines.map((routine) => (
                      <RoutinePostCard
                        key={routine._id}
                        post={routine}
                        isLiked={Math.random() < 0.5}
                        isSaved={Math.random() < 0.5}
                        currentUserId={userId}
                        onMediaClick={openMediaViewer}
                        onDelete={() => {}}
                        onEdit={() => {}}
                      />
                    ))}
                  </Box>
                ) : (
                  <>
                    <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                      No routines found
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary", mb: 3 }}
                    >
                      Try adjusting your search or filters to find what you're
                      looking for.
                    </Typography>
                  </>
                )}
              </div>
            )}

            {results.successStories.length > 0 && (
              <div>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ mb: 3, fontWeight: "bold", color: "text.primary" }}
                >
                  Inspiring Stories
                </Typography>
                {results.successStories.length > 0 ? (
                  <Box sx={{ display: "grid", gap: 3 }}>
                    {results.successStories.map((story, index) => (
                      <SuccessStoryPostCard
                        key={index}
                        post={story}
                        isLiked={Math.random() < 0.5}
                        isSaved={Math.random() < 0.5}
                        addVerifiedExpert={addVerifiedExpert}
                        currentUserId={userId}
                        onMediaClick={openMediaViewer}
                        menuItems={[]}
                        handleVerifiersDialogOpen={handleVerifiersDialogOpen}
                        handleInvalidDialogOpen={handleInvalidDialogOpen}
                        verificationLoading={verificationLoading}
                        setVerificationLoading={setVerificationLoading}
                      />
                    ))}
                  </Box>
                ) : (
                  <>
                    <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                      No Success Stories found
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary", mb: 3 }}
                    >
                      Try adjusting your search or filters to find what you're
                      looking for.
                    </Typography>
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </Box>
      {/* Media Viewer Dialog */}
      <MediaViewerDialog
        open={openMediaDialog}
        images={mediaDialogImages}
        title={""}
        selectedImageIndex={selectedMediaImageIndex || 0}
        onClose={closeMediaViewer}
        // onNext={handleNextImage}
        // onPrev={handlePrevImage}
      />

      {/* Verifiers Dialog at top level for AI search */}
      <VerifiersDialog
        open={verifiersDialogOpen}
        onClose={() => {
          setVerifiersDialogOpen(false);
          setVerifiersDialogData([]);
        }}
        verifiers={verifiersDialogData}
        postTitle={verifiersDialogPostTitle}
      />
      {/* Invalid Dialog at top level for AI search */}
      <InvalidDialog
        open={invalidDialogOpen}
        onClose={() => {
          setInvalidDialogOpen(false);
          setInvalidReason("");
        }}
        onConfirm={confirmInvalid}
        reason={invalidReason}
        setReason={setInvalidReason}
        loading={verificationLoading}
      />
    </Box>
  );
};

export default AISearchPage;
