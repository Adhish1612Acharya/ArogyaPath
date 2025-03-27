// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Leaf } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';

// export function LoginPage() {
//   const [userType, setUserType] = useState<'patient' | 'expert'>('patient');

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader className="space-y-4">
//           <div className="flex justify-center">
//             <Leaf className="h-12 w-12 text-green-600" />
//           </div>
//           <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
//           <CardDescription className="text-center">
//             Login to your AyurCare account
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="userType">I am a</Label>
//             <Select
//               value={userType}
//               onValueChange={(value: 'patient' | 'expert') => setUserType(value)}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select user type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="patient">Patient</SelectItem>
//                 <SelectItem value="expert">Healthcare Expert</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input id="email" type="email" placeholder="Enter your email" />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="password">Password</Label>
//             <Input id="password" type="password" placeholder="Enter your password" />
//           </div>
//           <Button className="w-full">Login</Button>
//         </CardContent>
//         <CardFooter className="flex flex-col space-y-2">
//           <p className="text-sm text-gray-600">
//             Don't have an account?{' '}
//             <Link to="/register" className="text-green-600 hover:underline">
//               Register here
//             </Link>
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }