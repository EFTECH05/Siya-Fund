import {
  createGroup as createGroupService,
  getUserGroups as getUserGroupsService,
  getGroupById as getGroupByIdService,
} from "../services/GroupService";
import { Group } from "../models/Group";
import { auth } from "../services/firebase";

// Handle Create Group
export const handleCreateGroup = async (
  name: string,
  description: string
): Promise<string> => {
  if (!name || !description) {
    throw new Error("Group name and description are required.");
  }
  if (!auth.currentUser) {
    throw new Error("You must be logged in to create a group.");
  }

  const creatorId = auth.currentUser.uid;

  const groupData = {
    name,
    description,
    creatorId,
    members: [creatorId], // Creator is the first member
  };

  const groupId = await createGroupService(groupData);
  return groupId;
};

// Fetch User Groups
export const fetchUserGroups = async (): Promise<Group[]> => {
  if (!auth.currentUser) {
    throw new Error("User not authenticated.");
  }
  return await getUserGroupsService(auth.currentUser.uid);
};

// Fetch Group by ID
export const fetchGroupById = async (groupId: string): Promise<Group | null> => {
  return await getGroupByIdService(groupId);
};