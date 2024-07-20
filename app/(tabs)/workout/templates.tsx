import Template from "@/components/workout/Template";
import { dropAllTables } from "@/db/base";
import { getExerciseRows } from "@/db/models/exercise-model";
import { getSetRows } from "@/db/models/set-model";
import { getWorkoutSessionRows } from "@/db/models/workout-model";
import Submit, { ButtonVariant } from "@/forms/Submit";
import useExerciseStore from "@/stores/exercises";
import useSetStore from "@/stores/sets";
import useSettingsStore from "@/stores/settings";
import useWorkoutStore from "@/stores/workout";
import { ColorScheme } from "@/util/colors";
import { routes } from "@/util/routes";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useMemo, useRef } from "react";
import { Text, View, StyleSheet } from "react-native";

const WORKOUT_QUERY_LIMIT = 5 as const;

export default function Page() {
  const router = useRouter();
  const db = useSQLiteContext();
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme]);
  const createExercise = useExerciseStore((s) => s.createExercise);
  const addExercise = useWorkoutStore((s) => s.addExercise);
  const createWorkout = useWorkoutStore((s) => s.createWorkout);
  const loadFromWorkoutRow = useWorkoutStore((s) => s.loadFromRow);
  const createFromExerciseRow = useExerciseStore((s) => s.createFromRow);
  const addSet = useExerciseStore((s) => s.addSet);
  const createSet = useSetStore((s) => s.createSet);
  const createFromSetRow = useSetStore((s) => s.createFromSetRow);
  const addInProgress = useWorkoutStore((s) => s.addInProgress);
  const inProgress = useWorkoutStore((s) => s.inProgress);
  const loaded = useWorkoutStore((s) => s.loaded);
  const offset = useRef(0);

  const createNewWorkout = () => {
    let wid = createWorkout();
    let eid = createExercise();
    addExercise(wid, eid);
    let sid = createSet();
    addSet(eid, sid);
    addInProgress(wid);
    router.push({ pathname: routes.workout(wid) });
  };

  useEffect(() => {
    getWorkoutSessionRows(db, WORKOUT_QUERY_LIMIT, offset.current).then(
      async (workoutRows) => {
        console.log(workoutRows);
        for (let i = 0; i < workoutRows.length; ++i) {
          let workoutId = loadFromWorkoutRow(workoutRows[i]);
          let exerciseRows = await getExerciseRows(db, workoutRows[i].id);
          for (let j = 0; j < exerciseRows.length; ++j) {
            let exerciseId = createFromExerciseRow(exerciseRows[j]);
            let setRows = await getSetRows(db, exerciseRows[j].id);
            addExercise(workoutId, exerciseId);
            for (let k = 0; k < setRows.length; ++k) {
              let setId = createFromSetRow(setRows[k]);
              addSet(exerciseId, setId);
            }
          }
        }
      },
    );
    offset.current += WORKOUT_QUERY_LIMIT;
  }, []);

  return (
    <View style={[styles.container, calcStyle.container]}>
      <Text style={[styles.headerText, calcStyle.headerText]}>Workouts</Text>

      {inProgress.length > 0 && (
        <Text style={[styles.subHeaderText, calcStyle.subHeaderText]}>
          In Progress
        </Text>
      )}

      {inProgress.toReversed().map((id) => (
        <Template key={`inprogress.${id}`} id={id} />
      ))}

      <Submit
        btnProps={{
          text: "NEW WORKOUT",
          primaryColor: scheme.primary,
          secondaryColor: scheme.quaternary,
          variant: ButtonVariant.Filled,
        }}
        touchableProps={{ onPress: createNewWorkout }}
      />

      {loaded.length > 0 && (
        <Text style={[styles.subHeaderText, calcStyle.subHeaderText]}>
          My Workouts
        </Text>
      )}

      {loaded.map((id) => (
        <Template key={`workout.${id}`} id={id} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    fontFamily: "PermanentMarker",
    fontSize: 25,
  },
  subHeaderText: {
    fontSize: 15,
    width: "100%",
  },
});

const calcStyles = (scheme: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: scheme.primary,
    },
    headerText: {
      color: scheme.tertiary,
    },
    subHeaderText: {
      color: scheme.secondary,
    },
  });
