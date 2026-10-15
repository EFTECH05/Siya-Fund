import { useLocalSearchParams } from "expo-router";
import LoanDetailsScreen from "../../views/screens/LoanDetailsScreen";

export default function LoanDetailsRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  return <LoanDetailsScreen id={typeof id === "string" ? id : ""} />;
}
