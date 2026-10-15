
export interface Contribution {
  id?: string;
  memberId: string;
  groupId: string;
  amount: number;
  date: Date;
  status: string;
}

export const createContribution = ({
  memberId,
  groupId,
  amount,
}: {
  memberId: string;
  groupId: string;
  amount: number;
}): Contribution => ({
  memberId: memberId.trim(),
  groupId: groupId.trim(),
  amount: Number(amount),
  date: new Date(),
  status: "Pending",
});