
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";

import { db } from "./firebase";
import type { Contribution } from "../models/Contribution";

const CONTRIBUTIONS_COLLECTION = "contributions";

export const ContributionService = {
  async recordContribution(
    contribution: Contribution
  ): Promise<string> {
    const docRef = await addDoc(
      collection(db, CONTRIBUTIONS_COLLECTION),
      {
        ...contribution,
        date: Timestamp.fromDate(contribution.date),
      }
    );

    return docRef.id;
  },

  async getContributionHistory(
    memberId: string,
    groupId: string
  ): Promise<Contribution[]> {
    const historyQuery = query(
      collection(db, CONTRIBUTIONS_COLLECTION),
      where("memberId", "==", memberId),
      where("groupId", "==", groupId),
      orderBy("date", "desc")
    );

    const snapshot = await getDocs(historyQuery);

    return snapshot.docs.map((document) => {
      const data = document.data();

      return {
        id: document.id,
        memberId: data.memberId,
        groupId: data.groupId,
        amount: data.amount,
        date: data.date?.toDate
          ? data.date.toDate()
          : new Date(),
        status: data.status,
      };
    });
  },
};