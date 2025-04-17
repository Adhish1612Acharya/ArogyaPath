// UserCompleteProfile.tsx

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const userSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(10, 'Phone number is required'),
  age: z.string().min(1, 'Age is required'),
  gender: z.string().min(1, 'Gender is required'),
  healthGoals: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

const UserCompleteProfile: React.FC = () => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      age: '',
      gender: '',
      healthGoals: '',
    },
  });

  const onSubmit = (data: UserFormData) => {
    console.log('User Profile Data:', data);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-100">
    <div className="max-w-3xl w-screen mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center text-indigo-800">Complete Your ArogyaPath Profile</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {['fullName', 'email', 'phone', 'age', 'gender'].map((field) => (
  <FormField
    key={field}
    control={form.control}
    name={field as keyof UserFormData}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="capitalize">{field.name}</FormLabel>
        <FormControl>
          <Input {...field} placeholder={`Enter ${field}`} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
))}

          <FormField
            control={form.control}
            name="healthGoals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Health Goals</FormLabel>
                <FormControl>
                  <Textarea rows={3} placeholder="What are your wellness goals?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4 text-center">
            <Button type="submit" variant="contained" color="primary" size="large" startIcon={<CheckCircleIcon />}>
              Complete Profile
            </Button>
          </div>
        </form>
      </Form>
    </div>
    </div>
  );
};

export default UserCompleteProfile;
