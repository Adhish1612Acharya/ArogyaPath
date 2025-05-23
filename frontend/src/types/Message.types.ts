export interface Message {
  _id: string;
  owner: { _id: string };
  message: string;
  createdAt: string;
  updatedAt: string;
}
