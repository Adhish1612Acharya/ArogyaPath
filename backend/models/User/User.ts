import mongoose, { Schema, Document, Model } from "mongoose";
import IUser from "./User.types";
import passportLocalMongoose from "passport-local-mongoose";


const userSchema = new Schema<IUser>(
  {
    username:{
        type:String,
        required:true
    },
    email: { type: String, required: true, unique: true },
    profile:{
        profileImage: { type: String, default:"" },
        fullname: { type: String, required: true ,default:""},
        age: { type: Number, required: true, min: 1, max: 120 ,default:0},
        contact: { type: String,default:0 },
    },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    completeProfile:{
        type:Boolean,
        default:false
      },
      role:{
        type:String,
        default:"user"
      }
  },
 
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

// Define the model with TypeScript type
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
export { IUser };
