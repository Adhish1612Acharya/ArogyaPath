import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Leaf, User, LogOut } from 'lucide-react';
import { User as UserType } from '@/types';

interface NavbarProps {
  userType: 'expert' | 'patient';
  user?: UserType;
}

export function Navbar({ userType, user }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = {
    expert: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/posts', label: 'Posts' },
      { href: '/patients', label: 'Patients' },
      { href: '/schedule', label: 'Schedule' },
    ],
    patient: [
      { href: '/posts', label: 'Health Feed' },
      { href: '/prakrithi/analysis', label: 'Prakrithi Analysis' },
      { href: '/ai-query', label: 'AI Query Search' },
      { href: '/my-health', label: 'My Health' },
    ],
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm'
          : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and App Name */}
          <div className="flex items-center">
          <Link 
              to="/" 
              className="flex items-center space-x-2 group"
            >
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
            {navLinks[userType].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="relative text-blue-700 font-medium hover:text-blue-900 transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-blue-500 hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Auth Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
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
                  <DropdownMenuItem className="text-red-600 hover:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  className="text-blue-700 hover:bg-blue-50"
                  asChild
                >
                  <Link to="/auth">Login</Link>
                </Button>
                <Button className="bg-[#2563eb] !text-white hover:bg-[#3b82f6]" asChild>
  <Link to="/auth">Register</Link>
</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
