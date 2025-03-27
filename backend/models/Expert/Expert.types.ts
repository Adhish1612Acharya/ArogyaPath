interface IProfile {
  username: string;
  experience: number;
  qualification: string;
}

export interface IExperts extends Document {
  fullname: string;
  email: string;
  contact: string;
  profile: IProfile;
}
