import { Box, Button, Tooltip } from "@mui/material";
import { CheckCircle, Warning } from "@mui/icons-material";
import { Loader2 } from "lucide-react";
import { SuccessStoryType } from "@/types/SuccessStory.types";

export const VerificationBadge = ({
  verificationStatus,
  showVerifyActions,
  setShowVerifyActions,
  post,
  verificationLoading,
  handleVerify,
  handleMarkInvalid,
  canVerifyOrInvalidate,
}: {
  verificationStatus: "verified" | "invalid" | "unverified";
  showVerifyActions: boolean;
  setShowVerifyActions: (show: boolean) => void;
  post: SuccessStoryType;
  verificationLoading?: boolean;
  handleVerify: () => void;
  handleMarkInvalid: () => void;
  canVerifyOrInvalidate: boolean;
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {canVerifyOrInvalidate ? (
        <Tooltip
          title="Not yet verified by medical professionals. Click to verify or mark invalid."
          arrow
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "4px 8px",
              borderRadius: 1,
              backgroundColor: "grey.200",
              color: "grey.600",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginRight: 1,
              cursor: "pointer",
              "& svg": {
                marginRight: "4px",
                fontSize: "1rem",
              },
            }}
          >
            <Warning fontSize="small" />
            Please verify
          </Box>
        </Tooltip>
      ) : (
        <>
          {verificationStatus !== "unverified" &&
            post.verified.length + post.rejections.length > 0 && (
              <>
                <Tooltip title="Verified by medical professionals" arrow>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: "4px 8px",
                      borderRadius: 1,
                      backgroundColor: "success.light",
                      color: "success.dark",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginRight: 1,
                      cursor: "pointer",
                      "& svg": {
                        marginRight: "4px",
                        fontSize: "1rem",
                      },
                    }}
                  >
                    <CheckCircle fontSize="small" />
                    Verified
                  </Box>
                </Tooltip>

                <Tooltip title={`Invalid post:`} arrow>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: "4px 8px",
                      borderRadius: 1,
                      backgroundColor: "error.light",
                      color: "error.dark",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginRight: 1,
                      "& svg": {
                        marginRight: "4px",
                        fontSize: "1rem",
                      },
                    }}
                  >
                    <Warning fontSize="small" />
                    Invalid
                  </Box>
                </Tooltip>
              </>
            )}

          {verificationStatus === "verified" && <p>Verfied by you</p>}

          {verificationStatus === "invalid" && <p>Rejected By you</p>}

          {verificationStatus === "unverified" &&
            post.verified.length + post.rejections.length === 0 && (
              <Tooltip title="Not yet verified by medical professionals" arrow>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "4px 8px",
                    borderRadius: 1,
                    backgroundColor: "grey.200",
                    color: "grey.600",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginRight: 1,
                    "& svg": {
                      marginRight: "4px",
                      fontSize: "1rem",
                    },
                  }}
                >
                  <Warning fontSize="small" />
                  Unverified
                </Box>
              </Tooltip>
            )}
        </>
      )}
      {canVerifyOrInvalidate && showVerifyActions && (
        <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
          <Button
            variant="outlined"
            size="small"
            color="success"
            startIcon={
              verificationLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <CheckCircle />
              )
            }
            onClick={handleVerify}
            disabled={verificationLoading}
          >
            Verify
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            startIcon={
              verificationLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Warning />
              )
            }
            onClick={handleMarkInvalid}
            disabled={verificationLoading}
          >
            Mark Invalid
          </Button>
        </Box>
      )}
    </Box>
  );
};
