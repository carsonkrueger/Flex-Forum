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
import {
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Octicons } from "@expo/vector-icons";

import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Page() {
  const id = (useLocalSearchParams<{ id: string }>().id ?? 0) as number;
  const router = useRouter();
  const scheme = useSettingsStore((state) => state.colorScheme);
  const isLocked = useWorkoutStore((s) => s.workouts[id].isLocked);
  const toggleLocked = useWorkoutStore((s) => s.toggleLocked);
  const workout = useWorkoutStore((s) => s.workouts[id]);
  const addExercise = useWorkoutStore((s) => s.addExercise);
  const createExercise = useExerciseStore((s) => s.createExercise);
  const addSet = useExerciseStore((s) => s.addSet);
  const createSet = useSetStore((s) => s.createSet);
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme, isLocked]);

  function onCreateExercise(): void {
    let exerciseId = createExercise();
    addExercise(id, exerciseId);
    let setId = createSet();
    addSet(exerciseId, setId);
  }

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View style={[calcStyle.container, styles.container]}>
          <View style={[calcStyle.headerContainer, styles.headerContainer]}>
            <TextInput
              editable={!isLocked}
              style={[styles.headerText, calcStyle.headerText]}
            >
              {workout.name}
            </TextInput>
            <TouchableOpacity onPress={() => toggleLocked(id)}>
              <Octicons
                name={isLocked ? "lock" : "unlock"}
                size={30}
                color={scheme.primary}
              />
            </TouchableOpacity>
          </View>
          {/* Exercises */}
          <FlashList
            data={workout.exerciseIds}
            renderItem={({ item }) => <Exercise workoutId={id} id={item} />}
            estimatedItemSize={100}
            ListFooterComponent={
              !isLocked ? (
                <Submit
                  touchableProps={{ onPress: onCreateExercise }}
                  btnProps={{
                    primaryColor: scheme.quaternary,
                    text: "NEW EXERCISE",
                    variant: ButtonVariant.Filled,
                    secondaryColor: scheme.primary,
                  }}
                />
              ) : (
                <></>
              )
            }
            ListFooterComponentStyle={styles.addExercise}
          />
        </View>
        {/* Modal bottom sheet */}
        <BottomSheetModal>
          <BottomSheetView>
            <Text>hi</Text>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // zIndex: -1,
    // elevation: -1,
    height: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerText: {
    fontFamily: "PermanentMarker",
    fontSize: 30,
    textAlign: "center",
  },
  addExercise: {
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 250,
    paddingHorizontal: 100,
  },
});

const calcStyles = (scheme: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: scheme.primary,
    },
    headerContainer: {
      backgroundColor: scheme.quaternary,
    },
    headerText: {
      color: scheme.primary,
    },
  });
