import mongoose from "mongoose";

interface IProfile {
  fullname: string;
  experience: number;
  qualification: string;
  expertType:string;
  contact:number;
}

export interface IExpert extends Document {
  username: string;
  googleId: number;
  email: string;
  contact: string;
  profile: IProfile;
  posts: mongoose.Types.ObjectId[];
  completeProfile: boolean;
  role:"expert"
}
