import { z } from 'zod';

export const expertProfileSchema = z.object({
  dateOfBirth: z.date(),
  gender: z.string().min(1, 'Gender is required'),
  mobileNumber: z.string().min(10, 'Invalid mobile number').max(10, 'Invalid mobile number'),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pinCode: z.string().min(6, 'Invalid PIN code').max(6, 'Invalid PIN code'),
  ayushRegistrationNumber: z.string().min(1, 'Registration number is required'),
  registrationCouncil: z.string().min(1, 'Registration council is required'),
  yearOfRegistration: z.string().min(4, 'Invalid year').max(4, 'Invalid year'),
  yearsOfExperience: z.number().min(0, 'Years of experience must be 0 or more'),
  qualifications: z.array(
    z.object({
      year: z.string().min(4, 'Invalid year').max(4, 'Invalid year'),
      degree: z.string().min(1, 'Degree is required'),
      college: z.string().min(1, 'College is required')
    })
  ).min(1, 'At least one qualification is required'),
  specializations: z.array(z.string()).min(1, 'At least one specialization is required'),
  languages: z.array(z.string()).min(1, 'At least one language is required'),
  identityProof: z.instanceof(File).nullable(),
  degreeCertificate: z.instanceof(File).nullable(),
  registrationProof: z.instanceof(File).nullable(),
  practiceProof: z.instanceof(File).nullable(),
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(500, 'Bio must not exceed 500 characters')
});
