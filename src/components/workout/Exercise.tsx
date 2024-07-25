import useExerciseStore from "@/stores/exercises";
import useSettingsStore from "@/stores/settings";
import useWorkoutStore, { Id } from "@/stores/workout";
import { ColorScheme } from "@/util/colors";
import { useMemo } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Set from "./Set";
import flexWidths from "@/util/setFlexWidths";
import { Ionicons } from "@expo/vector-icons";
import useExercisePresetStore, {
  ExercisePreset,
} from "@/stores/exercise-presets";

export type Props = {
  id: Id;
  workoutId: Id;
};

export default function Exercise({ id, workoutId }: Props) {
  const scheme = useSettingsStore((state) => state.colorScheme);
  const isLocked = useWorkoutStore((s) => s.workouts[workoutId].isLocked);
  const setExerciseSheetIndex = useWorkoutStore((s) => s.setExerciseSheetId);
  const setSelectSheetIndex = useWorkoutStore((s) => s.setSelectSheetId);
  const calcStyle = useMemo(
    () => calcStyles(scheme, isLocked),
    [scheme, isLocked],
  );
  const exercise = useExerciseStore((s) => s.exercises[id]);
  // const preset: ExercisePreset | undefined =
  //   exercise.exerciseId !== undefined
  //     ? useExercisePresetStore((s) => s.presets[exercise.exerciseId!])
  //     : undefined;
  const getPreset = useExercisePresetStore((s) => s.getPreset);

  const onEllipsisClick = () => {
    setExerciseSheetIndex(exercise.id);
  };

  const onSelectExerciseClick = () => {
    setSelectSheetIndex(exercise.id);
  };

  return (
    <View style={[styles.container, calcStyle.container]}>
      {/* Header container */}
      <View style={[styles.headerContainer, calcStyle.headerContainer]}>
        {/* Top header */}
        <View style={styles.topHeaderContainer}>
          <TouchableOpacity onPress={onSelectExerciseClick} disabled={isLocked}>
            <Text style={[styles.headerText, calcStyle.headerText]}>
              {getPreset(exercise.exerciseId ?? 0)?.name ?? "Select Exercise"}
            </Text>
          </TouchableOpacity>
          {!isLocked && (
            <TouchableOpacity onPress={onEllipsisClick}>
              <Ionicons
                name="ellipsis-horizontal-sharp"
                size={20}
                color={scheme.quaternary}
              />
            </TouchableOpacity>
          )}
        </View>
        {/* Bottom header */}
        <View style={styles.btmHeaderContainer}>
          <Text
            style={[
              styles.columnHeaderText,
              calcStyle.columnHeaderText,
              { flex: flexWidths.set },
            ]}
          >
            SET
          </Text>
          <Text
            style={[
              styles.columnHeaderText,
              calcStyle.columnHeaderText,
              { flex: flexWidths.prevVol },
            ]}
          >
            PREV{"\n"}VOL
          </Text>
          <Text
            style={[
              styles.columnHeaderText,
              calcStyle.columnHeaderText,
              { flex: flexWidths.curVol },
            ]}
          >
            CUR{"\n"}VOL
          </Text>
          <Text
            style={[
              styles.columnHeaderText,
              calcStyle.columnHeaderText,
              { flex: flexWidths.weight },
            ]}
          >
            WEIGHT
          </Text>
          <Text
            style={[
              styles.columnHeaderText,
              calcStyle.columnHeaderText,
              { flex: flexWidths.reps },
            ]}
          >
            REPS
          </Text>
          {/* empty view for check box header */}
          <View style={{ flex: flexWidths.check }} />
        </View>
      </View>
      {/* Sets */}
      {exercise.setIds.map((setId, idx) => (
        <Set key={`set.${setId}`} id={setId} idx={idx} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  headerContainer: {
    paddingVertical: 5,
  },
  topHeaderContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  btmHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  headerText: {
    fontFamily: "PermanentMarker",
    fontSize: 20,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 140,
  },
  columnHeaderText: {
    fontSize: 12,
    textAlign: "center",
    alignSelf: "center",
  },
  exerciseMenu: {
    position: "absolute",
    top: 10,
    right: 8,
    elevation: 1000,
  },
});

const calcStyles = (scheme: ColorScheme, isLocked: boolean) =>
  StyleSheet.create({
    container: {},
    headerContainer: {},
    headerText: {
      color: isLocked ? scheme.tertiary : scheme.tertiary,
      backgroundColor: isLocked ? scheme.primary : scheme.secondary,
    },
    columnHeaderText: {
      color: scheme.tertiary,
    },
    addSet: {
      backgroundColor: scheme.loQuaternary,
    },
  });
