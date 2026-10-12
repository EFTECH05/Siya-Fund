import { Timestamp } from "firebase/firestore";

export interface Group {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  members: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}