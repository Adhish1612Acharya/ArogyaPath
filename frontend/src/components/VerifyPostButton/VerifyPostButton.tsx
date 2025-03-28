import { useState, useRef, useEffect, FC } from "react";
import { X, User, Loader2 } from "lucide-react";
import styles from "./VerifyPostButton.module.css";
import VerifyPostButtonProps from "./VerifyPostButton.types";
import VerifiedPostProfile from "@/types/verifiedPostProfileInfo";

const VerifyPostButton: FC<VerifyPostButtonProps> = ({
  userRole,
  verifiedProfiles,
}) => {
  const [verified, setVerified] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const [postVerifiedProfiles, setPostVerifiedProfiles] = useState<
    VerifiedPostProfile[]
  >(verifiedProfiles);

  // Toggle popup when clicking the verified button
  const handleVerifiedClick = () => {
    setShowPopup(!showPopup);
  };

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowPopup(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block">
      {userRole && (
        <button
          onClick={handleVerifiedClick}
          className={`cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-300 ease-in-out ${
            verifiedProfiles?.length > 0
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
          disabled={verifiedProfiles?.length === 0}
        >
          <div>
            {verifiedProfiles?.length > 0 ? "Verified" : "Under Verification"}
          </div>
        </button>
      )}

      {/* Popup showing verified users */}
      {showPopup && (
        <>
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-200 z-50"></div>
          <div
            ref={popupRef}
            className={`absolute top-full left-1 transform -translate-x-1/2 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 border border-gray-200 overflow-hidden ${styles.animateFadeIn}`}
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
          >
            <div className="flex justify-between items-center p-2 border-b border-gray-100 bg-gray-50">
              <h3 className="font-medium text-sm text-gray-700">Verified Users</h3>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
            <ul className="max-h-48 overflow-y-auto py-1">
              {postVerifiedProfiles.map((user) => (
                <li
                  key={user.id}
                  className="px-3 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 flex-shrink-0 border border-gray-200">
                    {user.profilePic ? (
                      <img
                        src={user.profilePic || "/placeholder.svg"}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User size={14} />
                    )}
                  </div>
                  <span className="text-gray-800 font-medium">{user.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default VerifyPostButton;
