import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import {
  LocationOn,
  Work,
  School,
  Star,
  StarHalf,
  StarBorder,
  CalendarToday,
  AccessTime,
  Verified,
  Language,
  Email,
  Phone,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Doctor {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  hospital: string;
  university: string;
  verified: boolean;
  rating: number;
  reviews: number;
  experience: number;
  location: string;
  languages: string[];
  email: string;
  phone: string;
  about: string;
  education: Array<{
    degree: string;
    university: string;
    year: string;
  }>;
  experienceList: Array<{
    position: string;
    hospital: string;
    period: string;
  }>;
  services: Array<{
    name: string;
    price: string;
  }>;
  availability: Array<{
    day: string;
    time: string;
  }>;
}

const DoctorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch the doctor data from an API
    const fetchDoctorData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          // Mock data - replace with actual API call
          const mockDoctor: Doctor = {
            id: id || "1",
            name: "Dr. Sarah Johnson",
            avatar: "https://randomuser.me/api/portraits/women/65.jpg",
            specialty: "Cardiologist",
            hospital: "Mount Sinai Hospital",
            university: "Harvard Medical School",
            verified: true,
            rating: 4.8,
            reviews: 124,
            experience: 15,
            location: "New York, USA",
            languages: ["English", "Spanish", "French"],
            email: "s.johnson@example.com",
            phone: "+1 (555) 123-4567",
            about:
              "Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience. She specializes in interventional cardiology and has performed over 2,000 successful procedures. Dr. Johnson is committed to providing personalized care to each of her patients.",
            education: [
              {
                degree: "MD in Cardiology",
                university: "Harvard Medical School",
                year: "2005-2009",
              },
              {
                degree: "Residency in Internal Medicine",
                university: "Massachusetts General Hospital",
                year: "2009-2012",
              },
              {
                degree: "Fellowship in Interventional Cardiology",
                university: "Johns Hopkins Hospital",
                year: "2012-2015",
              },
            ],
            experienceList: [
              {
                position: "Senior Cardiologist",
                hospital: "Mount Sinai Hospital",
                period: "2015-Present",
              },
              {
                position: "Cardiologist",
                hospital: "New York Presbyterian Hospital",
                period: "2012-2015",
              },
            ],
            services: [
              { name: "Consultation", price: "$200" },
              { name: "Echocardiogram", price: "$350" },
              { name: "Stress Test", price: "$400" },
              { name: "Angioplasty", price: "$5,000" },
            ],
            availability: [
              { day: "Monday", time: "9:00 AM - 5:00 PM" },
              { day: "Tuesday", time: "9:00 AM - 5:00 PM" },
              { day: "Wednesday", time: "10:00 AM - 6:00 PM" },
              { day: "Friday", time: "8:00 AM - 4:00 PM" },
            ],
          };
          setDoctor(mockDoctor);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} color="primary" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={i} color="primary" />);
      } else {
        stars.push(<StarBorder key={i} color="primary" />);
      }
    }

    return stars;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography variant="h6">Loading doctor profile...</Typography>
      </Box>
    );
  }

  if (!doctor) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
        flexDirection="column"
      >
        <Typography variant="h6" gutterBottom>
          Doctor not found
        </Typography>
        <Button variant="contained" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        {/* Header Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Avatar
                    src={doctor.avatar}
                    alt={doctor.name}
                    sx={{
                      width: 150,
                      height: 150,
                      mb: 2,
                      border: "3px solid #4caf50",
                    }}
                  />
                  <Button variant="contained" fullWidth sx={{ mb: 2 }}>
                    Book Appointment
                  </Button>
                  <Button variant="outlined" fullWidth>
                    Message
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={9}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="h4" component="h1" sx={{ mr: 2 }}>
                    {doctor.name}
                  </Typography>
                  {doctor.verified && (
                    <Verified color="primary" fontSize="large" />
                  )}
                </Box>

                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ mb: 1, display: "flex", alignItems: "center" }}
                >
                  <Work sx={{ mr: 1 }} /> {doctor.specialty}
                </Typography>

                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, display: "flex", alignItems: "center" }}
                >
                  <LocationOn sx={{ mr: 1 }} /> {doctor.hospital} •{" "}
                  {doctor.location}
                </Typography>

                <Box display="flex" alignItems="center" mb={2}>
                  {renderRatingStars(doctor.rating)}
                  <Typography variant="body1" sx={{ ml: 1 }}>
                    {doctor.rating} ({doctor.reviews} reviews)
                  </Typography>
                </Box>

                <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                  <Chip
                    icon={<AccessTime />}
                    label={`${doctor.experience} years experience`}
                    variant="outlined"
                  />
                  <Chip
                    icon={<School />}
                    label={doctor.university}
                    variant="outlined"
                  />
                  {doctor.languages.map((lang) => (
                    <Chip
                      key={lang}
                      icon={<Language />}
                      label={lang}
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Typography variant="body1" paragraph>
                  {doctor.about}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Overview" />
            <Tab label="Education" />
            <Tab label="Experience" />
            <Tab label="Services" />
            <Tab label="Availability" />
            <Tab label="Contact" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Professional Information
              </Typography>
              <Typography variant="body1" paragraph>
                {doctor.about}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Specializations
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
                <Chip label="Interventional Cardiology" />
                <Chip label="Cardiac Catheterization" />
                <Chip label="Coronary Artery Disease" />
                <Chip label="Heart Failure" />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Languages Spoken
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {doctor.languages.map((lang) => (
                  <Chip
                    key={lang}
                    icon={<Language />}
                    label={lang}
                    variant="outlined"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {activeTab === 1 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Education
              </Typography>
              <List>
                {doctor.education.map((edu, index) => (
                  <ListItem key={index} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        <School />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={edu.degree}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {edu.university}
                          </Typography>
                          {` • ${edu.year}`}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {activeTab === 2 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Professional Experience
              </Typography>
              <List>
                {doctor.experienceList.map((exp, index) => (
                  <ListItem key={index} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "secondary.main" }}>
                        <Work />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <>
                          <Typography
                            component="span"
                            variant="subtitle1"
                            color="text.primary"
                          >
                            {exp.position}
                          </Typography>
                          {` • ${exp.hospital}`}
                        </>
                      }
                      secondary={exp.period}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {activeTab === 3 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Services & Pricing
              </Typography>
              <List>
                {doctor.services.map((service, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={service.name} />
                    <Typography variant="body1">{service.price}</Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {activeTab === 4 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Availability
              </Typography>
              <Grid container spacing={2}>
                {doctor.availability.map((slot, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                          <CalendarToday sx={{ mr: 1 }} />
                          <Typography variant="subtitle1">{slot.day}</Typography>
                        </Box>
                        <Typography variant="body2">{slot.time}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {activeTab === 5 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <Email />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Email"
                    secondary={doctor.email}
                    secondaryTypographyProps={{
                      component: "a",
                      href: `mailto:${doctor.email}`,
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <Phone />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Phone"
                    secondary={doctor.phone}
                    secondaryTypographyProps={{
                      component: "a",
                      href: `tel:${doctor.phone.replace(/\D/g, "")}`,
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <LocationOn />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Location"
                    secondary={doctor.hospital + ", " + doctor.location}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        )}

        {/* Reviews Section (Always visible) */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Patient Reviews
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              {renderRatingStars(doctor.rating)}
              <Typography variant="h6" sx={{ ml: 1 }}>
                {doctor.rating} out of 5
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({doctor.reviews} reviews)
              </Typography>
            </Box>

            {/* Mock Reviews - in a real app these would come from an API */}
            <Box>
              <Box sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Avatar
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    sx={{ mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1">John D.</Typography>
                    <Box display="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          color={i <= 5 ? "primary" : "disabled"}
                          fontSize="small"
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ ml: 7 }}>
                  "Dr. Johnson was very thorough and took the time to explain
                  everything clearly. Her expertise in cardiology is evident, and
                  I felt completely comfortable under her care."
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: 7, display: "block" }}
                >
                  Posted 2 weeks ago
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Avatar
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    sx={{ mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1">Maria S.</Typography>
                    <Box display="flex">
                      {[1, 2, 3, 4].map((i) => (
                        <Star
                          key={i}
                          color={i <= 4 ? "primary" : "disabled"}
                          fontSize="small"
                        />
                      ))}
                      <StarBorder color="primary" fontSize="small" />
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ ml: 7 }}>
                  "Excellent doctor with great bedside manner. The only reason I'm
                  not giving 5 stars is because the wait time was a bit long, but
                  once I saw her, the quality of care was outstanding."
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: 7, display: "block" }}
                >
                  Posted 1 month ago
                </Typography>
              </Box>
            </Box>

            <Button variant="outlined" sx={{ mt: 2 }}>
              See All Reviews
            </Button>
          </CardContent>
        </Card>
      </Box>
    </motion.div>
  );
};

export default DoctorProfile;