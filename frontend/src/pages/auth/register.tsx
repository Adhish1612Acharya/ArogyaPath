import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function RegisterPage() {
  const [userType, setUserType] = useState<'patient' | 'expert'>('patient');

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <Leaf className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Join AyurCare and start your wellness journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userType">I want to register as</Label>
            <Select
              value={userType}
              onValueChange={(value: 'patient' | 'expert') => setUserType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient">Patient</SelectItem>
                <SelectItem value="expert">Healthcare Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Enter your full name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
          {userType === 'expert' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bams">BAMS</SelectItem>
                    <SelectItem value="md">MD Ayurveda</SelectItem>
                    <SelectItem value="phd">PhD in Ayurveda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input id="experience" type="number" min="0" placeholder="Years of experience" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Clinic Location</Label>
                <Input id="location" placeholder="Enter clinic location" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License Number</Label>
                <Input id="license" placeholder="Enter medical license number" />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Create a password" />
          </div>
          <Button className="w-full">Create Account</Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:underline">
              Login here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}