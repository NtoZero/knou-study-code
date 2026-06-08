import OfficialExercisesPage from "@/components/officialExercises/OfficialExercisesPage";
import { getOfficialExerciseData } from "@/lib/officialExercises";

export default function OfficialExercisesRoute() {
  const data = getOfficialExerciseData();
  return <OfficialExercisesPage {...data} />;
}
