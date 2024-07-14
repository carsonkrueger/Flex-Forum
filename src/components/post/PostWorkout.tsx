import ContentModel, {
  downloadContent,
  WorkoutSummary,
} from "@/models/content-model";
import useSettingsStore from "@/stores/settings";
import { ColorScheme } from "@/util/colors";
import { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Text } from "react-native";

export type Props = {
  contentModel: ContentModel;
  width: number;
  aspectRatio?: number;
};

export default function PostImage({
  contentModel,
  width,
  aspectRatio = 1,
}: Props) {
  const scheme = useSettingsStore((state) => state.colorScheme);
  // const calcStyle = useMemo(
  //   () => calcStyles(width, aspectRatio, scheme),
  //   [scheme],
  // );
  const [workout, setWorkout] = useState<WorkoutSummary | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const calcStyle = useMemo(() => calcStyles(width, scheme), [width, scheme]);

  useEffect(() => {
    if (workout != null) return;

    downloadContent<WorkoutSummary>(contentModel, "json").then((data) => {
      setWorkout(data);
    });
  }, []);

  return (
    <View>
      {workout && (
        <View>
          {/* Header */}
          <Text style={[styles.workoutNameHeader, calcStyle.workoutNameHeader]}>
            {workout.workout_name.toUpperCase()}
          </Text>
          <View style={[styles.workoutHeader, calcStyle.workoutHeader]}>
            <Text
              style={[styles.exerciseNameHeader, calcStyle.exerciseNameHeader]}
            >
              Exercise
            </Text>
            <Text style={[styles.setsHeader, calcStyle.setsHeader]}>Sets</Text>
            <Text style={[styles.repsHeader, calcStyle.repsHeader]}>Reps</Text>
          </View>

          {/* Body */}
          <View style={[styles.body]}>
            {workout.exercises.map((e) => (
              <View>
                <Text>{e.exercise_name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const exerciseNameFlex = 3;
const setsFlex = 1.3;
const repsFlex = 1.3;

const calcStyles = (width: number, scheme: ColorScheme) =>
  StyleSheet.create({
    workoutHeader: {
      width: width,
      backgroundColor: scheme.quaternary,
    },
    workoutNameHeader: {
      color: scheme.tertiary,
    },
    exerciseNameHeader: {
      color: scheme.primary,
    },
    setsHeader: {
      color: scheme.primary,
    },
    repsHeader: {
      color: scheme.primary,
    },
  });

const styles = StyleSheet.create({
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  workoutNameHeader: {
    textAlign: "center",
    fontSize: 17,
    paddingVertical: 6,
  },
  exerciseNameHeader: {
    flex: exerciseNameFlex,
  },
  setsHeader: {
    flex: setsFlex,
    textAlign: "center",
  },
  repsHeader: {
    flex: repsFlex,
    textAlign: "center",
  },
  body: {
    flexDirection: "column",
    gap: 8,
    padding: 8,
  },
});
