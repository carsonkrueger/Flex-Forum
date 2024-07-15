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
        <>
          <View style={[styles.body, calcStyle.body]}>
            {/* Workout Name */}
            <Text
              style={[
                styles.roundItem,
                calcStyle.exercise,
                calcStyle.workoutName,
              ]}
            >
              {workout.workout_name}
            </Text>
            {/* Exercises */}
            {workout.exercises.map((e, idx) => (
              <View
                key={`ex.${contentModel.post_id}.${idx}`}
                style={[styles.roundItem, calcStyle.exercise]}
              >
                <Text style={[styles.exerciseText, calcStyle.exerciseText]}>
                  {e.exercise_name}
                </Text>
                <Text style={[styles.exerciseText, calcStyle.exerciseText]}>
                  {e.num_sets}x{e.num_reps}
                </Text>
              </View>
            ))}
            <View style={[styles.roundItem, calcStyle.timer]}>
              <Text style={[calcStyle.timerText]}>120</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const calcStyles = (width: number, scheme: ColorScheme) =>
  StyleSheet.create({
    body: {
      width: width,
    },
    workoutName: {
      backgroundColor: scheme.tertiary,
      color: scheme.primary,
    },
    exercise: {
      backgroundColor: scheme.quaternary,
    },
    exerciseText: {
      color: scheme.primary,
    },
    timer: {
      backgroundColor: scheme.tertiary,
    },
    timerText: {
      color: scheme.primary,
    },
  });

const styles = StyleSheet.create({
  body: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    padding: 10,
  },
  roundItem: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    maxWidth: 200,
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 14,
  },
  exerciseText: {},
});
