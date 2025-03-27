import mongoose from "mongoose";

// Define an interface for the user document
interface IUser extends Document {
  email: string;
  contact: string;
  username: string;
  completeProfile:boolean;
  profile:{
    profileImage:string;
    fullname: string;
    age: number;
    contact: string;
  } 
  posts:mongoose.Types.ObjectId[];
  bookmarks:mongoose.Types.ObjectId[];
}

export default IUser;