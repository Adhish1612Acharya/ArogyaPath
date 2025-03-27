export interface User {
  id: string;
  email: string;
  name: string;
  role: 'expert' | 'patient';
  profileImage?: string;
}

export interface Expert extends User {
  education: string;
  experience: string;
  clinicLocation: string;
  licenseNumber: string;
}

export interface Patient extends User {
  medicalHistory?: string;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  images?: string[];
  videos?: string[];
  createdAt: Date;
  type: 'general' | 'routine';
}

export interface RoutineActivity {
  time: string;
  activity: string;
}

export interface RoutinePost extends Post {
  activities: RoutineActivity[];
}