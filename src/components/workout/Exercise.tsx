import useExerciseStore from "@/stores/exercises";
import useSettingsStore from "@/stores/settings";
import { Id } from "@/stores/workout";
import { ColorScheme } from "@/util/colors";
import { useMemo } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Set from "./Set";
import useSetStore from "@/stores/sets";

export type Props = {
  id: Id;
};

export default function Exercise({ id }: Props) {
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme]);
  const exercise = useExerciseStore((s) => s.exercises[id]);
  const addSet = useExerciseStore((s) => s.addSet);
  const createSet = useSetStore((s) => s.createSet);

  const onCreateSet = () => {
    // let setId = createSet();
    addSet(id, createSet());
  };

  return (
    <View style={[styles.container, calcStyle.container]}>
      {/* Header container */}
      <View style={styles.headerContainer}>
        {/* Top header */}
        <View style={styles.topHeaderContainer}>
          <Text style={[styles.headerText, calcStyle.headerText]}>
            {exercise.name}
          </Text>
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
            set
          </Text>
          <Text
            style={[
              styles.columnHeaderText,
              calcStyle.columnHeaderText,
              { flex: flexWidths.prev },
            ]}
          >
            prev
          </Text>
          <Text
            style={[
              styles.columnHeaderText,
              calcStyle.columnHeaderText,
              { flex: flexWidths.weight },
            ]}
          >
            weight
          </Text>
          <Text
            style={[
              styles.columnHeaderText,
              calcStyle.columnHeaderText,
              { flex: flexWidths.reps },
            ]}
          >
            reps
          </Text>
          {/* empty view for check box header */}
          <View style={{ flex: flexWidths.check }} />
        </View>
      </View>
      {/* Sets */}
      {exercise.setIds.map((setId, idx) => (
        <Set key={`set.${setId}`} id={setId} idx={idx} />
      ))}
      {/* Add set */}
      <TouchableOpacity
        style={[styles.addSet, calcStyle.addSet]}
        onPress={onCreateSet}
      />
    </View>
  );
}

const flexWidths = {
  set: 1,
  prev: 2,
  weight: 2,
  reps: 2,
  check: 1,
};

const styles = StyleSheet.create({
  container: {},
  headerContainer: {},
  topHeaderContainer: {
    flexDirection: "row",
  },
  btmHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  headerText: {
    fontSize: 18,
  },
  columnHeaderText: {
    fontSize: 12,
    textAlign: "center",
  },
  addSet: { width: 20, height: 20 },
});

const calcStyles = (scheme: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: scheme.secondary,
    },
    headerContainer: {},
    headerText: {
      color: scheme.tertiary,
    },
    columnHeaderText: {
      color: scheme.tertiary,
    },
    addSet: {
      backgroundColor: scheme.loQuaternary,
    },
  });

export { flexWidths };
