import useExerciseStore, { Exercise } from "@/stores/exercises";
import useSettingsStore from "@/stores/settings";
import useWorkoutStore, { Workout } from "@/stores/workout";
import { ColorScheme } from "@/util/colors";
import { routes } from "@/util/routes";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

export type Props = {
  id: number;
};

export default function Page(props: Props) {
  const router = useRouter();
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme]);
  const workout = useWorkoutStore((s) => s);
  const createExercise = useExerciseStore((s) => s.createExercise);

  const createFakeWorkout = () => {
    let w: Workout = {
      id: 0,
      exerciseIds: [0],
      name: "push",
    };
    workout.setWorkout(w);
    createExercise();
    onPress();
  };

  const onPress = () => {
    router.push({ pathname: routes.workout(props.id) });
  };

  return (
    <TouchableOpacity
      style={[styles.container, calcStyle.container]}
      activeOpacity={0.5}
      onPress={createFakeWorkout}
    >
      <View style={styles.leftTemplate}>
        <Text style={[styles.templateHeader, calcStyle.text]}>template</Text>
      </View>
    </TouchableOpacity>
  );
}

const calcStyles = (scheme: ColorScheme) =>
  StyleSheet.create({
    container: {
      borderColor: scheme.secondary,
    },
    text: {
      color: scheme.tertiary,
    },
    subText: {
      color: scheme.secondary,
    },
  });

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 7,
    minHeight: 80,
    width: "100%",
    maxWidth: 450,
  },
  templateHeader: {
    fontFamily: "PermanentMarker",
    fontSize: 17,
    lineHeight: 18,
  },
  leftTemplate: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  rightTemplate: {
    flex: 1,
    flexDirection: "column",
  },
  subText: {},
});
