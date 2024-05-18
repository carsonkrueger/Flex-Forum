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
        <Text style={[styles.headerText, calcStyle.headerText]}>
          {exercise.name}
        </Text>
      </View>
      {/* Sets */}
      {exercise.setIds.map((setId) => (
        <Set key={`set.${setId}`} id={setId} />
      ))}
      {/* Add set */}
      <TouchableOpacity
        style={[styles.addSet, calcStyle.addSet]}
        onPress={onCreateSet}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  headerContainer: {
    flexDirection: "row",
  },
  headerText: {
    fontSize: 18,
  },
  addSet: { width: 20, height: 20 },
});

const calcStyles = (scheme: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: scheme.quaternary,
      padding: 8,
    },
    headerContainer: {},
    headerText: {
      color: scheme.primary,
    },
    addSet: {
      backgroundColor: scheme.loQuaternary,
    },
  });
