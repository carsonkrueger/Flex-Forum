import Template from "@/components/workout/Template";
import Submit, { ButtonVariant } from "@/forms/Submit";
import useExerciseStore from "@/stores/exercises";
import useSetStore from "@/stores/sets";
import useSettingsStore from "@/stores/settings";
import useWorkoutStore from "@/stores/workout";
import { ColorScheme } from "@/util/colors";
import { routes } from "@/util/routes";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Text, View, StyleSheet } from "react-native";

export default function Page() {
  const router = useRouter();
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme]);
  const createExercise = useExerciseStore((s) => s.createExercise);
  const addExercise = useWorkoutStore((s) => s.addExercise);
  const createWorkout = useWorkoutStore((s) => s.createWorkout);
  const addSet = useExerciseStore((s) => s.addSet);
  const createSet = useSetStore((s) => s.createSet);
  const startWorkout = useWorkoutStore((s) => s.startWorkout);
  const inProgress = useWorkoutStore((s) => s.inProgress);

  const createNewWorkout = () => {
    let wid = createWorkout();
    let eid = createExercise();
    addExercise(wid, eid);
    let sid = createSet();
    addSet(eid, sid);
    startWorkout(wid);
    router.push({ pathname: routes.workout(wid) });
  };

  return (
    <View style={[styles.container, calcStyle.container]}>
      <Text style={[styles.headerText, calcStyle.headerText]}>Workouts</Text>

      {inProgress.length > 0 && (
        <Text style={[styles.subHeaderText, calcStyle.subHeaderText]}>
          In Progress
        </Text>
      )}

      {inProgress.map((id) => (
        <Template key={`inprogress.${id}`} id={id} />
      ))}

      <Submit
        btnProps={{
          text: "New Workout",
          primaryColor: scheme.quaternary,
          secondaryColor: scheme.primary,
          variant: ButtonVariant.Filled,
        }}
        touchableProps={{ onPress: createNewWorkout }}
      />
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
