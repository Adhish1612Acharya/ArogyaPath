import { IExpert } from "../models/Expert/Expert.types";


declare global {
  namespace Express {
    interface User extends IExpert {
      _id: string;
      googleId?: number;
      username: string;
      email?: string;
      role: "expert" | "user";
    }

    // interface User extends providerSchemaObj {
    //   _id: string;
    //   role: string;
    //   username: string;
    // }
  }
}

export interface User {
  _id: string;
  googleId?: number;
  username: string;
  email?: string;
  role: "expert" | "user";
}
