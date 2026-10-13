import { Timestamp } from "firebase/firestore";

export interface Group {
  id: string;
  name: string;
  description: string;
  /** UID of the user who created (and administrates) the group */
  creatorId: string;
  /** Array of member UIDs */
  members: string[];
  /** Shareable 6-character alphanumeric code for joining */
  joinCode: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface GroupMember {
  uid: string;
  email: string;
  displayName: string;
}
