import Exercise from "@/components/workout/Exercise";
import Submit, { ButtonVariant } from "@/forms/Submit";
import useExerciseStore from "@/stores/exercises";
import useSetStore from "@/stores/sets";
import useSettingsStore from "@/stores/settings";
import useWorkoutStore from "@/stores/workout";
import { ColorScheme } from "@/util/colors";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
  Button,
} from "react-native";
import { Octicons } from "@expo/vector-icons";

import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CircularButton from "@/forms/CircularButton";
import { SizeVariant } from "@/util/variants";
import { Ionicons } from "@expo/vector-icons";

export default function Page() {
  const id = (useLocalSearchParams<{ id: string }>().id ?? 0) as number;
  const router = useRouter();
  const scheme = useSettingsStore((state) => state.colorScheme);
  const isLocked = useWorkoutStore((s) => s.workouts[id].isLocked);
  const toggleLocked = useWorkoutStore((s) => s.toggleLocked);
  const workout = useWorkoutStore((s) => s.workouts[id]);
  const addExercise = useWorkoutStore((s) => s.addExercise);
  const removeExercise = useWorkoutStore((s) => s.removeExercise);
  const createExercise = useExerciseStore((s) => s.createExercise);
  const deleteExercise = useExerciseStore((s) => s.deleteExercise);
  const getExercise = useExerciseStore((s) => s.getExercise);
  const addSet = useExerciseStore((s) => s.addSet);
  const popSet = useExerciseStore((s) => s.popSet);
  const createSet = useSetStore((s) => s.createSet);
  const deleteSet = useSetStore((s) => s.deleteSet);
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme, isLocked]);
  const setSheetIndex = useWorkoutStore((s) => s.setSheetIndex);
  const sheetIndex = useWorkoutStore((s) => s.sheetIndex);
  const sheetRef = useRef<BottomSheetModal>(null);

  function onCreateExercise(): void {
    let exerciseId = createExercise();
    addExercise(id, exerciseId);
    let setId = createSet();
    addSet(exerciseId, setId);
  }

  function onToggleLocked(): void {
    if (sheetIndex !== undefined) {
      setSheetIndex(undefined);
    }
    toggleLocked(id);
  }

  function onSheetChange(index: number): void {
    // if index is -1 then it is closed
    if (index === -1) {
      setSheetIndex(undefined);
    }
  }

  function onAddSet(): void {
    if (sheetIndex !== undefined) {
      addSet(sheetIndex, createSet());
    }
  }

  function onRemoveSet(): void {
    if (sheetIndex !== undefined) {
      let setId = popSet(sheetIndex);
      if (setId !== undefined) {
        deleteSet(setId);
      }
      let setsLen = getExercise(sheetIndex).setIds.length;
      if (setsLen === 0) {
        addSet(sheetIndex, createSet());
      }
    }
  }

  function onDeleteExercise() {
    if (sheetIndex === undefined) {
      return;
    }
    removeExercise(id, sheetIndex);
    deleteExercise(sheetIndex);
  }

  useEffect(() => {
    if (sheetIndex !== undefined) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.close();
    }
  }, [sheetIndex]);

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
            <TouchableOpacity onPress={onToggleLocked}>
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
        <BottomSheetModal
          ref={sheetRef}
          snapPoints={["40%"]}
          onChange={onSheetChange}
          backgroundStyle={[styles.bottomSheet, calcStyle.bottomSheetContainer]}
          handleIndicatorStyle={{ backgroundColor: scheme.loPrimary }}
        >
          <BottomSheetView style={styles.bottomSheetView}>
            <View style={styles.bottomSheetRowContainer}>
              <CircularButton
                backgroundColor={scheme.quaternary}
                size={SizeVariant.LG}
                onPress={onRemoveSet}
              >
                <Ionicons
                  name="remove-outline"
                  size={22}
                  color={scheme.hiPrimary}
                />
              </CircularButton>
              <Text style={[styles.sheetText, calcStyle.sheetText]}>SETS</Text>
              <CircularButton
                backgroundColor={scheme.quaternary}
                size={SizeVariant.LG}
                onPress={onAddSet}
              >
                <Ionicons
                  name="add-outline"
                  size={22}
                  color={scheme.hiPrimary}
                />
              </CircularButton>
            </View>

            <Submit
              btnProps={{
                text: "NOTES",
                primaryColor: scheme.secondary,
                secondaryColor: scheme.tertiary,
                variant: ButtonVariant.Filled,
              }}
            />

            <Submit
              btnProps={{
                text: "DELETE EXERCISE",
                primaryColor: scheme.hiPrimary,
                secondaryColor: scheme.quaternary,
                variant: ButtonVariant.Filled,
              }}
              touchableProps={{ onPress: onDeleteExercise }}
            />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
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
    paddingHorizontal: 100,
    marginBottom: 300,
  },
  bottomSheet: {},
  bottomSheetView: {
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  bottomSheetRowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    paddingVertical: 10,
  },
  sheetText: {
    fontSize: 15,
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
    bottomSheetContainer: {
      backgroundColor: scheme.hiPrimary,
    },
    sheetText: {
      color: scheme.tertiary,
    },
  });
