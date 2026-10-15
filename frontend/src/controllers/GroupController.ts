import {
  createGroup as createGroupService,
  getUserGroups as getUserGroupsService,
  getGroupById as getGroupByIdService,
  addMemberToGroup,
  removeMemberFromGroup,
  joinGroupByCode,
  getMemberProfiles,
} from "../services/GroupService";
import { Group, GroupMember } from "../models/Group";
import { auth } from "../services/firebase";

// ── Helpers ───────────────────────────────────────────────────────────────────

const requireAuth = () => {
  if (!auth.currentUser) throw new Error("You must be logged in.");
  return auth.currentUser;
};

const requireAdmin = (group: Group) => {
  const user = requireAuth();
  if (group.creatorId !== user.uid) {
    throw new Error("Only the group administrator can perform this action.");
  }
  return user;
};

// ── Create ────────────────────────────────────────────────────────────────────

export const handleCreateGroup = async (
  name: string,
  description: string
): Promise<string> => {
  if (!name.trim() || !description.trim()) {
    throw new Error("Group name and description are required.");
  }
  const user = requireAuth();
  const groupId = await createGroupService({
    name: name.trim(),
    description: description.trim(),
    creatorId: user.uid,
    members: [user.uid],
  });
  return groupId;
};

// ── Read ──────────────────────────────────────────────────────────────────────

export const fetchUserGroups = async (): Promise<Group[]> => {
  const user = requireAuth();
  return getUserGroupsService(user.uid);
};

export const fetchGroupById = async (groupId: string): Promise<Group | null> => {
  return getGroupByIdService(groupId);
};

/**
 * Fetches display profiles for every member of the given group.
 */
export const fetchGroupMembers = async (
  groupId: string
): Promise<GroupMember[]> => {
  const group = await getGroupByIdService(groupId);
  if (!group) return [];
  return getMemberProfiles(group.members);
};

// ── Membership ────────────────────────────────────────────────────────────────

/**
 * Joins a group using a 6-character join code.
 * Returns the groupId on success.
 */
export const handleJoinGroup = async (joinCode: string): Promise<string> => {
  const user = requireAuth();
  if (!joinCode.trim()) throw new Error("Please enter a join code.");
  return joinGroupByCode(joinCode.trim(), user.uid);
};

/**
 * Admin-only: adds a user by their UID to the group.
 * Prevents duplicates — the underlying arrayUnion is idempotent.
 */
export const handleAddMember = async (
  group: Group,
  targetUserId: string
): Promise<void> => {
  requireAdmin(group);
  if (!targetUserId.trim()) throw new Error("User ID is required.");
  if (group.members.includes(targetUserId)) {
    throw new Error("This user is already a member of the group.");
  }
  await addMemberToGroup(group.id, targetUserId);
};

/**
 * Admin-only: removes a member from the group.
 * The group creator cannot be removed.
 */
export const handleRemoveMember = async (
  group: Group,
  targetUserId: string
): Promise<void> => {
  requireAdmin(group);
  await removeMemberFromGroup(group.id, targetUserId, group.creatorId);
};
