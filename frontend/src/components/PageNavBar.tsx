import { FC, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Divider,
  Slide,
  useScrollTrigger,
  Fade,
  styled,
  alpha,
  Container,
  Badge,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { 
  Spa as LeafIcon,
  Person as UserIcon,
  Logout as LogOutIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Feed as FeedIcon,
  FitnessCenter as FitnessIcon,
  Star as StarIcon,
  Search as SearchIcon,
  AddCircle as AddIcon,
  Psychology as PsychologyIcon,
  Edit as EditIcon,
  Notifications as NotificationsIcon
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import useApi from "@/hooks/useApi/useApi";
import { toast } from "react-toastify";
import { handleAxiosError } from "@/utils/handleAxiosError";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: 'blur(20px)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&.scrolled': {
    boxShadow: theme.shadows[6],
    background: alpha(theme.palette.background.paper, 0.98),
    height: '64px'
  }
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 600,
  fontSize: '0.875rem',
  textTransform: 'none',
  letterSpacing: '0.02em',
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    transform: 'translateY(-2px)',
    '&:before': {
      width: '100%'
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 0,
    height: 3,
    backgroundColor: theme.palette.primary.main,
    transition: 'width 0.3s ease'
  },
  '&.active': {
    color: theme.palette.primary.main,
    '&:before': {
      width: '100%'
    }
  }
}));

const LogoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)'
  }
}));

const LogoIcon = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  marginRight: theme.spacing(1),
  borderRadius: 12,
  background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 6px rgba(76, 175, 80, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'rotate(12deg) scale(1.1)'
  }
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  background: 'linear-gradient(45deg, #4CAF50 30%, #2E7D32 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontSize: '1.5rem',
  letterSpacing: '-0.5px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.3rem'
  }
}));

const MobileMenu = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[4],
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  zIndex: theme.zIndex.appBar - 1,
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const PageNavBar: FC = () => {
  const { get } = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { role, isLoggedIn, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const [logOutLoad, setLogOutLoad] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  
  const scrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
    target: window
  });

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== hasScrolled) {
        setHasScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolled]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationsAnchorEl(null);
  };

  if (isLoggedIn === undefined) {
    return null;
  }

  const common = [
    { href: "/", label: "Home", icon: <HomeIcon fontSize="small" /> },
    { href: "/gposts", label: "Health Feed", icon: <FeedIcon fontSize="small" /> },
    { href: "/routines", label: "Routines", icon: <FitnessIcon fontSize="small" /> },
    { href: "/success-stories", label: "Success Stories", icon: <StarIcon fontSize="small" /> },
    { href: "/ai-query", label: "AI Query", icon: <SearchIcon fontSize="small" /> },
  ];

  const navLinks = {
    expert: [
      ...common,
      { href: "/expert/posts/create", label: "Create Post", icon: <AddIcon fontSize="small" /> }
    ],
    user: [
      ...common,
      { href: "/prakrithi/analysis", label: "Prakrithi", icon: <PsychologyIcon fontSize="small" /> },
      { href: "/user/success-stories/create", label: "Share Story", icon: <EditIcon fontSize="small" /> },
    ],
    noUser: [
      { href: "/", label: "Home", icon: <HomeIcon fontSize="small" /> },
      { href: "/auth", label: "Login", icon: <UserIcon fontSize="small" /> },
      { href: "/auth?signUpRedirect=true", label: "Sign Up", icon: <UserIcon fontSize="small" /> },
    ],
  };

  const currentLinks = navLinks[role !== undefined && isLoggedIn === true ? role : "noUser"];

  const logout = async () => {
    try {
      setLogOutLoad(true);
      const response = await get(`${import.meta.env.VITE_SERVER_URL}/api/auth/logout`);
      if (response.success) {
        toast.success("Logged out successfully");
      }
      setLogOutLoad(false);
      handleMenuClose();
      navigate("/");
    } catch (error) {
      handleAxiosError(error);
      setLogOutLoad(false);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <StyledAppBar className={scrolled ? 'scrolled' : ''} elevation={0}>
      <Container maxWidth="xl">
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          px: { xs: 0, sm: 2 },
          py: scrolled ? 1 : 1.5,
          transition: 'all 0.3s ease'
        }}>
          {/* Logo and App Name */}
          <LogoBox component={Link} to="/">
            <LogoIcon>
              <LeafIcon sx={{ color: 'common.white', fontSize: 28 }} />
            </LogoIcon>
            <LogoText variant="h6">
              ArogyaPath
            </LogoText>
          </LogoBox>

          {/* Desktop Navigation */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center', 
            gap: 1,
            ml: 4
          }}>
            {currentLinks.map((link) => (
              <NavButton
                key={link.href}
                component={Link}
                to={link.href}
                startIcon={link.icon}
                className={isActive(link.href) ? 'active' : ''}
                sx={{
                  mx: 0.5,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {link.label}
              </NavButton>
            ))}
          </Box>

          {/* User Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {role && (
              <>
                <IconButton
                  size="medium"
                  color="inherit"
                  onClick={handleNotificationsOpen}
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2)
                    }
                  }}
                >
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Menu
                  anchorEl={notificationsAnchorEl}
                  open={Boolean(notificationsAnchorEl)}
                  onClose={handleMenuClose}
                  MenuListProps={{
                    sx: {
                      minWidth: 320,
                      py: 0
                    }
                  }}
                >
                  <MenuItem dense sx={{ backgroundColor: 'action.hover', py: 1 }}>
                    <Typography variant="subtitle2">Notifications (3)</Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleMenuClose}>
                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                      <Avatar sx={{ width: 40, height: 40, mr: 2 }}>R</Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>New routine suggestion</Typography>
                        <Typography variant="caption" color="text.secondary">2 hours ago</Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose}>
                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                      <Avatar sx={{ width: 40, height: 40, mr: 2 }}>A</Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>Your Prakrithi analysis is ready</Typography>
                        <Typography variant="caption" color="text.secondary">1 day ago</Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                  <Divider />
                  <MenuItem dense onClick={handleMenuClose} sx={{ justifyContent: 'center' }}>
                    <Typography variant="body2" color="primary">View All Notifications</Typography>
                  </MenuItem>
                </Menu>
              </>
            )}

            {role ? (
              <>
                <IconButton
                  onClick={handleMenuOpen}
                  size="medium"
                  sx={{
                    ml: 1,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2)
                    }
                  }}
                >
                  <Avatar
                    sx={{ 
                      width: 36, 
                      height: 36,
                      transition: 'all 0.3s ease',
                    }}
                    src={user?.avatar}
                  >
                    {user?.name?.[0]?.toUpperCase() || <UserIcon />}
                  </Avatar>
                </IconButton>
                <Menu
                  id="profile-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose}
                  PaperProps={{
                    elevation: 4,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.1))',
                      mt: 1.5,
                      minWidth: 220,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={() => navigate('/profile')} sx={{ py: 1.5 }}>
                    <Avatar src={user?.avatar} /> 
                    <Box ml={1}>
                      <Typography variant="subtitle2">{user?.name || 'User'}</Typography>
                      <Typography variant="caption" color="text.secondary">View Profile</Typography>
                    </Box>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={logout} disabled={logOutLoad} sx={{ py: 1.5 }}>
                    {logOutLoad ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Box sx={{ animation: 'spin 1s linear infinite', mr: 1 }}>
                          <LogOutIcon />
                        </Box>
                        Logging out...
                      </Box>
                    ) : (
                      <>
                        <LogOutIcon sx={{ mr: 1.5, color: 'text.secondary' }} /> 
                        <Typography variant="body2">Logout</Typography>
                      </>
                    )}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              !isMobile && (
                <>
                  <Button
                    component={Link}
                    to="/auth"
                    variant="text"
                    sx={{
                      fontWeight: 600,
                      ml: 1
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/auth?signUpRedirect=true"
                    variant="contained"
                    color="primary"
                    sx={{
                      fontWeight: 600,
                      ml: 1,
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                      }
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )
            )}

            {/* Mobile Menu Button */}
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              sx={{
                display: { xs: 'flex', md: 'none' },
                ml: 1,
                backgroundColor: mobileMenuOpen ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>

        {/* Mobile Menu */}
        {isMobile && (
          <Fade in={mobileMenuOpen}>
            <MobileMenu>
              {currentLinks.map((link) => (
                <Button
                  key={link.href}
                  component={Link}
                  to={link.href}
                  startIcon={link.icon}
                  fullWidth
                  sx={{
                    justifyContent: 'flex-start',
                    px: 3,
                    py: 1.5,
                    mb: 0.5,
                    borderRadius: 1,
                    fontWeight: 600,
                    color: isActive(link.href) ? 'primary.main' : 'text.primary',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1)
                    }
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Button>
              ))}
              {role && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Button
                    startIcon={<UserIcon />}
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      px: 3,
                      py: 1.5,
                      mb: 0.5,
                      borderRadius: 1,
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1)
                      }
                    }}
                    onClick={() => {
                      navigate('/profile');
                      setMobileMenuOpen(false);
                    }}
                  >
                    My Profile
                  </Button>
                  <Button
                    startIcon={<NotificationsIcon />}
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      px: 3,
                      py: 1.5,
                      mb: 0.5,
                      borderRadius: 1,
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1)
                      }
                    }}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setNotificationsAnchorEl(document.getElementById('notifications-button'));
                    }}
                  >
                    Notifications
                    <Box sx={{ 
                      backgroundColor: 'error.main', 
                      color: 'white', 
                      borderRadius: '50%', 
                      width: 20, 
                      height: 20, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '0.75rem',
                      ml: 1
                    }}>
                      3
                    </Box>
                  </Button>
                  <Button
                    startIcon={<LogOutIcon />}
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      px: 3,
                      py: 1.5,
                      borderRadius: 1,
                      fontWeight: 600,
                      color: 'error.main',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.error.main, 0.1)
                      }
                    }}
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    disabled={logOutLoad}
                  >
                    {logOutLoad ? 'Logging out...' : 'Logout'}
                  </Button>
                </>
              )}
              {!role && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Button
                    component={Link}
                    to="/auth"
                    variant="outlined"
                    fullWidth
                    sx={{
                      justifyContent: 'center',
                      py: 1.5,
                      mb: 1,
                      fontWeight: 600
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/auth?signUpRedirect=true"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                      justifyContent: 'center',
                      py: 1.5,
                      fontWeight: 600,
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                      }
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </MobileMenu>
          </Fade>
        )}
      </Container>
    </StyledAppBar>
  );
};

export default PageNavBar;