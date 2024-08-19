import useSettingsStore from "@/stores/settings";
import useWorkoutStore, { Id } from "@/stores/workout";
import { ColorScheme } from "@/util/colors";
import { useMemo } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Set from "./Set";
import flexWidths from "@/util/setFlexWidths";
import { Ionicons } from "@expo/vector-icons";
import useExercisePresetStore from "@/stores/exercise-presets";

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
  const exercise = useWorkoutStore((s) => s.exercises[id]);
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
        <View style={[styles.topHeaderContainer, calcStyle.topHeaderContainer]}>
          <TouchableOpacity onPress={onSelectExerciseClick} disabled={isLocked}>
            <Text style={[styles.headerText, calcStyle.headerText]}>
              {exercise.presetId !== undefined
                ? getPreset(exercise.presetId)?.name
                : "Select Exercise"}
            </Text>
          </TouchableOpacity>
          {!isLocked && (
            <TouchableOpacity
              onPress={onEllipsisClick}
              style={{ padding: 10, marginRight: 5 }}
            >
              <Ionicons
                name="ellipsis-horizontal-sharp"
                size={16}
                color={scheme.quaternary}
              />
            </TouchableOpacity>
          )}
        </View>
        {/* Bottom header */}
        <View style={[styles.btmHeaderContainer, calcStyle.btmHeaderContainer]}>
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
  container: {
    paddingVertical: 10,
  },
  headerContainer: {
    // paddingVertical: 5,
  },
  topHeaderContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 10,
    paddingVertical: 6,
  },
  btmHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 5,
  },
  headerText: {
    // fontFamily: "PermanentMarker",
    fontFamily: "Oswald",
    fontSize: 19,
    borderRadius: 18,
    paddingVertical: 3,
    // minWidth: 140,
  },
  columnHeaderText: {
    fontFamily: "Oswald",
    fontSize: 12,
    textAlign: "center",
    alignSelf: "center",
  },
  // exerciseMenu: {
  //   position: "absolute",
  //   top: 15,
  //   right: 8,
  //   elevation: 1000,
  // },
});

const calcStyles = (scheme: ColorScheme, isLocked: boolean) =>
  StyleSheet.create({
    container: {},
    headerContainer: {},
    headerText: {
      paddingHorizontal: isLocked ? 2 : 14,
      color: isLocked ? scheme.quaternary : scheme.tertiary,
      backgroundColor: isLocked ? scheme.primary : scheme.secondary,
    },
    columnHeaderText: {
      color: scheme.tertiary,
      fontSize: 14,
    },
    topHeaderContainer: {
      // backgroundColor: scheme.loPrimary,
    },
    btmHeaderContainer: {
      // backgroundColor: scheme.,
    },
    addSet: {
      backgroundColor: scheme.loQuaternary,
    },
  });
