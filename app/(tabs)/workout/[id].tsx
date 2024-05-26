import Exercise from "@/components/workout/Exercise";
import Submit, { ButtonVariant } from "@/forms/Submit";
import useExerciseStore from "@/stores/exercises";
import useSetStore from "@/stores/sets";
import useSettingsStore from "@/stores/settings";
import useWorkoutStore from "@/stores/workout";
import { ColorScheme } from "@/util/colors";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
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
import Modal from "@/components/modal";

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
  const moveUp = useWorkoutStore((s) => s.moveUp);
  const moveDown = useWorkoutStore((s) => s.moveDown);
  const getExercise = useExerciseStore((s) => s.getExercise);
  const addSet = useExerciseStore((s) => s.addSet);
  const popSet = useExerciseStore((s) => s.popSet);
  const createSet = useSetStore((s) => s.createSet);
  const deleteSet = useSetStore((s) => s.deleteSet);
  const calcStyle = useMemo(
    () => calcStyles(scheme, isLocked),
    [scheme, isLocked],
  );
  const setSheetId = useWorkoutStore((s) => s.setSheetId);
  const sheetId = useWorkoutStore((s) => s.sheetId);
  const sheetRef = useRef<BottomSheetModal>(null);
  const setName = useWorkoutStore((s) => s.setName);

  function onCreateExercise(): void {
    let exerciseId = createExercise();
    addExercise(id, exerciseId);
    let setId = createSet();
    addSet(exerciseId, setId);
  }

  function onSetWorkoutName(text: string): void {
    setName(text, id);
  }

  function onToggleLocked(): void {
    if (sheetId !== undefined) {
      setSheetId(undefined);
    }
    toggleLocked(id);
  }

  function onSheetChange(index: number): void {
    // if index is -1 then it is closed
    if (index === -1) {
      setSheetId(undefined);
    }
  }

  function onAddSet(): void {
    if (sheetId !== undefined) {
      addSet(sheetId, createSet());
    }
  }

  function onRemoveSet(): void {
    if (sheetId !== undefined) {
      let setId = popSet(sheetId);
      if (setId !== undefined) {
        deleteSet(setId);
      }
      let setsLen = getExercise(sheetId).setIds.length;
      if (setsLen === 0) {
        addSet(sheetId, createSet());
      }
    }
  }

  function onDeleteExercise() {
    if (sheetId === undefined) {
      return;
    }
    removeExercise(id, sheetId);
    deleteExercise(sheetId);
  }

  function closeSheet() {
    setSheetId(undefined);
  }

  function onMoveUp() {
    if (sheetId === undefined) {
      return;
    }
    moveUp(id, sheetId);
  }

  function onMoveDown() {
    if (sheetId === undefined) {
      return;
    }
    moveDown(id, sheetId);
  }

  useEffect(() => {
    if (sheetId !== undefined && !isLocked) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.close();
    }
  }, [sheetId]);

  useEffect(() => {
    setSheetId(undefined);
  }, []);

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View style={[calcStyle.container, styles.container]}>
          <View style={[calcStyle.headerContainer, styles.headerContainer]}>
            <TextInput
              editable={!isLocked}
              style={[styles.headerText, calcStyle.headerText]}
              value={workout.name}
              onChangeText={onSetWorkoutName}
            />
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
        {/* Modal */}
        <Modal
          hidden={sheetId === undefined}
          zIndex={0}
          opacity={0}
          onPress={closeSheet}
        />
        {/* Modal bottom sheet */}
        <BottomSheetModal
          ref={sheetRef}
          snapPoints={["48%"]}
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

            <View style={styles.bottomSheetRowContainer}>
              <CircularButton
                backgroundColor={scheme.quaternary}
                size={SizeVariant.LG}
                onPress={onMoveDown}
              >
                <Ionicons
                  name="chevron-down"
                  size={22}
                  color={scheme.hiPrimary}
                />
              </CircularButton>
              <Text style={[styles.sheetText, calcStyle.sheetText]}>
                POSITION
              </Text>
              <CircularButton
                backgroundColor={scheme.quaternary}
                size={SizeVariant.LG}
                onPress={onMoveUp}
              >
                <Ionicons
                  name="chevron-up"
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
    minWidth: 220,
    maxWidth: 260,
    paddingHorizontal: 6,
    borderRadius: 8,
    fontFamily: "PermanentMarker",
    fontSize: 30,
    // textAlign: "center",
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

const calcStyles = (scheme: ColorScheme, isLocked: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: scheme.primary,
    },
    headerContainer: {
      backgroundColor: scheme.quaternary,
    },
    headerText: {
      backgroundColor: isLocked ? scheme.quaternary : scheme.loQuaternary,
      color: scheme.primary,
    },
    bottomSheetContainer: {
      backgroundColor: scheme.hiPrimary,
    },
    sheetText: {
      color: scheme.tertiary,
    },
  });
