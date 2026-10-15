import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { router } from "expo-router";
import { auth } from "../services/firebase";
import { Loan } from "../models/Loan";
import { loadLoanApplications, loadLoanDetails } from "../controllers/LoanController";

// Clear private data on logout/account changes; ignore results from old requests.
export function useLoanApplications(id?: string) {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    let request = 0;
    const unsubscribe = onAuthStateChanged(auth, async user => {
      const currentRequest = ++request;
      setLoans([]); setError(""); setLoading(true);
      if (!user) { router.replace("/login"); return; }
      try {
        const result = id === undefined ? await loadLoanApplications() : await loadLoanDetails(id);
        if (!active || request !== currentRequest || auth.currentUser?.uid !== user.uid) return;
        setLoans(Array.isArray(result) ? result : result ? [result] : []);
      } catch {
        if (active && request === currentRequest && auth.currentUser?.uid === user.uid) {
          setError("We could not load your loan information. Please try again.");
        }
      } finally {
        if (active && request === currentRequest && auth.currentUser?.uid === user.uid) setLoading(false);
      }
    });
    return () => { active = false; request++; unsubscribe(); };
  }, [id, revision]);
  return { loans, loading, error, refresh: () => setRevision(value => value + 1) };
}
