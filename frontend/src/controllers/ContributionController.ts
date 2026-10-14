
import { createContribution } from "../models/Contribution";
import { ContributionService } from "../services/ContributionService";

export const ContributionController = {
  async recordContribution(input: {
    memberId: string;
    groupId: string;
    amount: string | number;
  }): Promise<string> {
    const memberId = input.memberId.trim();
    const groupId = input.groupId.trim();
    const amountText = String(input.amount).trim();
    const amount = Number(amountText);

    if (!memberId) {
      throw new Error("Please enter your member ID.");
    }

    if (!groupId) {
      throw new Error("Please enter your group ID.");
    }

    if (
      amountText === "" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      throw new Error("Enter an amount greater than zero.");
    }

    const contribution = createContribution({
      memberId,
      groupId,
      amount,
    });

    return ContributionService.recordContribution(contribution);
  },

  async getContributionHistory(
    memberId: string,
    groupId: string
  ) {
    if (!memberId.trim() || !groupId.trim()) {
      throw new Error("Member ID and group ID are required.");
    }

    return ContributionService.getContributionHistory(
      memberId.trim(),
      groupId.trim()
    );
  },
};