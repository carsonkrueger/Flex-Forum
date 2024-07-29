import useExercisePresetStore from "@/stores/exercise-presets";
import useSettingsStore from "@/stores/settings";
import useWorkoutStore from "@/stores/workout";
import { ColorScheme } from "@/util/colors";
import { ROUTES } from "@/util/routes";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
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
  const setTemplateSheetId = useWorkoutStore((s) => s.setTemplateSheetId);
  const addInProgress = useWorkoutStore((s) => s.addInProgress);
  const removeLoaded = useWorkoutStore((s) => s.removeLoaded);
  const alreadyInProgress = useWorkoutStore((s) =>
    s.inProgress.includes(props.id),
  );
  const isLoaded = useWorkoutStore((s) => s.loaded.includes(props.id));
  const getExercise = useWorkoutStore((s) => s.getExercise);
  const getPreset = useExercisePresetStore((s) => s.getPreset);

  const onPress = () => {
    if (!alreadyInProgress) {
      addInProgress(props.id);
    }
    if (isLoaded) {
      removeLoaded(props.id);
    }
    router.push({
      pathname: ROUTES.workout(props.id),
    });
  };

  const onLongPress = () => {
    setTemplateSheetId(workout.id);
  };

  return (
    <TouchableOpacity
      style={[styles.container, calcStyle.container]}
      activeOpacity={0.5}
      onPress={onPress}
      onLongPress={onLongPress}
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
              {workout.lastPerformed?.toLocaleString()}
            </Text>
          </View>
        )}
      </View>
      {/* Exercise Names */}
      <View style={styles.rightTemplate}>
        {workout.exerciseIds.map((id, idx) =>
          idx < maxExercisesShown ? (
            <Text
              key={`ex.${props.id}.${id}`}
              style={[styles.subText, calcStyle.subText]}
            >
              {getExercise(id).setIds.length} x{" "}
              {getExercise(id).presetId !== undefined
                ? getPreset(getExercise(id).presetId!)?.name
                : "none"}
            </Text>
          ) : idx < maxExercisesShown + 1 ? (
            <Text key={`ellipses.${props.id}`} style={[calcStyle.ellipses]}>
              ...
            </Text>
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
    marginVertical: 4,
    minHeight: 80,
    width: "100%",
    maxWidth: 450,
  },
  templateHeader: {
    fontFamily: "Oswald",
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
    fontSize: 12,
    fontFamily: "Oswald",
  },
});
