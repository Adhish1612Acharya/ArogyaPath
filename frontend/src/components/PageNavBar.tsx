import { FC, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Leaf, User, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import useApi from "@/hooks/useApi/useApi";
import { toast } from "react-toastify";
import { handleAxiosError } from "@/utils/handleAxiosError";

const PageNavBar: FC = () => {
  const { get } = useApi();
  const navigate = useNavigate();
  const { role, isLoggedIn } = useAuth();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [logOutLoad, setLogOutLoad] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoggedIn === undefined) {
    return null; // or a loading skeleton/navbar
  }

  const common = [
    { href: "/", label: "Home" },
    { href: "/gposts", label: "Health Feed" },
    { href: "/routines", label: "Routines" },
    { href: "/success-stories", label: "Success Stories" },
    { href: "/ai-query", label: "AI Query Search" },
  ];

  const navLinks = {
    expert: [...common, { href: "/expert/posts/create", label: "Create Post" }],
    user: [
      ...common,
      { href: "/prakrithi/analysis", label: "Prakrithi Analysis" },
      { href: "/user/success-stories/create", label: "Share Story" },
    ],
    noUser: [
      { href: "/", label: "Home" },
      { href: "/auth", label: "Login" },
      { href: "/auth?signUpRedirect=true", label: "SignUp" },
    ],
  };

  const logout = async () => {
    try {
      setLogOutLoad(true);
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/logout`
      );
      if (response.success) {
        toast.success("Logged out successfully");
      }
      setLogOutLoad(false);
      navigate("/");
    } catch (error) {
      handleAxiosError(error);
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and App Name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 group-hover:rotate-12 transition-transform">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ArogyaPath
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks[
              role !== undefined && isLoggedIn === true ? role : "noUser"
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="relative text-blue-700 font-medium hover:text-blue-900 transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-blue-500 hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Navigation */}
          {role && (
            <div className="hidden md:flex items-center space-x-6">
              <Button
                onClick={logout}
                className="relative text-blue-700 font-medium hover:text-blue-900 transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-blue-500 hover:after:w-full after:transition-all after:duration-300"
              >
                Logout
              </Button>
            </div>
          )}

          {/* User Auth Actions */}
          <div className="flex items-center space-x-4">
            {role && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full hover:bg-blue-100"
                  >
                    <User className="h-5 w-5 text-blue-700" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="hover:bg-blue-100 text-blue-800">
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-blue-100 text-blue-800">
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 hover:bg-red-50"
                  >
                    {logOutLoad ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PageNavBar;
