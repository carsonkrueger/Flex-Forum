import ContentModel, {
  downloadContent,
  WorkoutSummary,
} from "@/models/content-model";
import useSettingsStore from "@/stores/settings";
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
  const calcStyle = useMemo(() => calcStyles(width), [width]);

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
          <View style={[styles.workoutHeader, calcStyle.workoutHeader]}>
            <Text>Exercise</Text>
            <Text>Sets</Text>
            <Text>Reps</Text>
          </View>
          <Text>{workout.workout_name}</Text>
        </View>
      )}
    </View>
  );
  // return (
  //   <Text>
  //     {contentModel.post_id}
  //     {contentModel.post_type}
  //     {}
  //   </Text>
  // );
}

const calcStyles = (width: number) =>
  StyleSheet.create({
    workoutHeader: {
      width: width,
    },
  });

const styles = StyleSheet.create({
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
