import Modal from "@/components/modal";
import Exercise from "@/components/workout/Exercise";
import Submit, { ButtonVariant } from "@/forms/Submit";
import useExerciseStore from "@/stores/exercises";
import useSetStore from "@/stores/sets";
import useSettingsStore from "@/stores/settings";
import useWorkoutStore from "@/stores/workout";
import { ColorScheme } from "@/util/colors";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Page() {
  const id = (useLocalSearchParams<{ id: string }>().id ?? 0) as number;
  const router = useRouter();
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme]);
  const workout = useWorkoutStore((s) => s.workouts[id]);
  const addExercise = useWorkoutStore((s) => s.addExercise);
  const createExercise = useExerciseStore((s) => s.createExercise);
  const addSet = useExerciseStore((s) => s.addSet);
  const createSet = useSetStore((s) => s.createSet);
  const [showModal, toggleModal] = useWorkoutStore((s) => [
    s.showModal,
    s.toggleModal,
  ]);

  function onCreateExercise(): void {
    let exerciseId = createExercise();
    addExercise(id, exerciseId);
    let setId = createSet();
    addSet(exerciseId, setId);
  }

  return (
    <View style={[calcStyle.container, styles.container]}>
      <Text style={[styles.headerText, calcStyle.headerText]}>
        {workout.name}
      </Text>
      {/* Exercises */}
      <FlashList
        data={workout.exerciseIds}
        renderItem={({ item }) => <Exercise id={item} />}
        estimatedItemSize={100}
        ListFooterComponent={
          <Submit
            touchableProps={{ onPress: onCreateExercise }}
            btnProps={{
              primaryColor: scheme.quaternary,
              text: "NEW EXERCISE",
              variant: ButtonVariant.Filled,
              secondaryColor: scheme.primary,
            }}
          />
        }
        ListFooterComponentStyle={styles.addExercise}
      />
      <Modal hidden={showModal} onPress={toggleModal} opacity={0.0} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: "100%",
  },
  headerText: {
    fontFamily: "PermanentMarker",
    fontSize: 30,
    textAlign: "center",
  },
  addExercise: {
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 150,
    paddingHorizontal: 100,
  },
});

const calcStyles = (scheme: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: scheme.primary,
    },
    headerText: {
      color: scheme.quaternary,
    },
  });
