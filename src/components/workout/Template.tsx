import useExerciseStore from "@/stores/exercises";
import useSettingsStore from "@/stores/settings";
import useWorkoutStore from "@/stores/workout";
import { ColorScheme } from "@/util/colors";
import { routes } from "@/util/routes";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

export type Props = {
  id: number;
};

const maxExercisesShown = 6 as const;

export default function Page(props: Props) {
  const router = useRouter();
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme]);
  const workout = useWorkoutStore((s) => s.workouts[props.id]);
  const addInProgress = useWorkoutStore((s) => s.addInProgress);
  const removeLoaded = useWorkoutStore((s) => s.removeLoaded);
  const alreadyInProgress = useWorkoutStore((s) =>
    s.inProgress.includes(props.id),
  );
  const isLoaded = useWorkoutStore((s) => s.loaded.includes(props.id));
  const getExercise = useExerciseStore((s) => s.getExercise);

  const onPress = () => {
    if (!alreadyInProgress) {
      addInProgress(props.id);
    }
    if (isLoaded) {
      removeLoaded(props.id);
    }
    router.push({ pathname: routes.workout(props.id) });
  };

  return (
    <TouchableOpacity
      style={[styles.container, calcStyle.container]}
      activeOpacity={0.5}
      onPress={onPress}
    >
      <View style={styles.leftTemplate}>
        <Text style={[styles.templateHeader, calcStyle.text]}>
          {workout.name}
        </Text>
        {workout.lastPerformed && (
          <View>
            <Text style={[styles.subText, calcStyle.subText]}>
              Last Performed:
            </Text>
            <Text style={[styles.subText, calcStyle.subText]}>
              {workout.lastPerformed?.toString()}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.rightTemplate}>
        {workout.exerciseIds.map((id, idx) =>
          idx < maxExercisesShown ? (
            <Text style={[styles.subText, calcStyle.subText]}>
              {getExercise(id).setIds.length} x {getExercise(id).name}
            </Text>
          ) : idx < maxExercisesShown + 1 ? (
            <Text style={[calcStyle.ellipses]}>...</Text>
          ) : null,
        )}
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
      color: scheme.hiSecondary,
    },
    ellipses: {
      color: scheme.hiSecondary,
      textAlign: "center",
    },
  });

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderRadius: 7,
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
    flexDirection: "column",
    justifyContent: "space-between",
  },
  rightTemplate: {
    maxWidth: 105,
    minWidth: 90,
    flexDirection: "column",
  },
  subText: {
    fontSize: 10,
  },
});
