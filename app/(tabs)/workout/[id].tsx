import Exercise from "@/components/workout/Exercise";
import Submit, { ButtonVariant } from "@/forms/Submit";
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
  TextInputTextInputEventData,
  NativeSyntheticEvent,
  BackHandler,
} from "react-native";
import { Octicons } from "@expo/vector-icons";

import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CircularButton from "@/forms/CircularButton";
import { SizeVariant } from "@/util/variants";
import { Ionicons } from "@expo/vector-icons";
import Modal from "@/components/modal";
import { ROUTES } from "@/util/routes";
import { saveWorkoutSession } from "@/db/row-models/workout-model";
import { saveExercise } from "@/db/row-models/exercise-model";
import { saveSet } from "@/db/row-models/set-model";
import { useSQLiteContext } from "expo-sqlite";
import useExercisePresetStore, {
  ExercisePreset,
} from "@/stores/exercise-presets";
import { createNewTemplate } from "@/db/row-models/workout-template-model";

export default function Page() {
  const db = useSQLiteContext();
  const id = parseInt(useLocalSearchParams<{ id: string }>().id ?? "1");
  const router = useRouter();
  const scheme = useSettingsStore((state) => state.colorScheme);
  const isLocked = useWorkoutStore((s) => s.workouts[id].isLocked);
  const toggleLocked = useWorkoutStore((s) => s.toggleLocked);
  const workout = useWorkoutStore((s) => s.workouts[id]);
  const removeInProgress = useWorkoutStore((s) => s.removeInProgress);
  const setTemplateId = useWorkoutStore((s) => s.setTemplateId);
  const addLoadedIfNotExists = useWorkoutStore((s) => s.addLoadedIfNotExists);
  const addExercise = useWorkoutStore((s) => s.addExercise);
  const setPerformed = useWorkoutStore((s) => s.setPerformed);
  const removeExercise = useWorkoutStore((s) => s.removeExercise);
  const createExercise = useWorkoutStore((s) => s.createExercise);
  const deleteExercise = useWorkoutStore((s) => s.deleteExercise);
  const moveUp = useWorkoutStore((s) => s.moveUp);
  const moveDown = useWorkoutStore((s) => s.moveDown);
  const getExercise = useWorkoutStore((s) => s.getExercise);
  const resetSet = useWorkoutStore((s) => s.resetSet);
  const getSet = useWorkoutStore((s) => s.getSet);
  const addSet = useWorkoutStore((s) => s.addSet);
  const popSet = useWorkoutStore((s) => s.popSet);
  const createSet = useWorkoutStore((s) => s.createSet);
  const deleteSet = useWorkoutStore((s) => s.deleteSet);
  const calcStyle = useMemo(
    () => calcStyles(scheme, isLocked),
    [scheme, isLocked],
  );
  const setExerciseSheetId = useWorkoutStore((s) => s.setExerciseSheetId);
  const exerciseSheetId = useWorkoutStore((s) => s.exerciseSheetId);
  const exerciseSheetRef = useRef<BottomSheetModal>(null);
  const setSelectSheetId = useWorkoutStore((s) => s.setSelectSheetId);
  const selectSheetId = useWorkoutStore((s) => s.selectSheetId);
  const selectSheetRef = useRef<BottomSheetModal>(null);
  const setName = useWorkoutStore((s) => s.setName);
  const setExerciseId = useWorkoutStore((s) => s.setExerciseId);
  const presets = useExercisePresetStore((s) => s.presets);
  const [filteredExercisedPresets, setFilteredExercisedPresets] =
    useState<ExercisePreset[]>(presets);
  const [showModal, setShowModal] = useState<boolean>(false);

  function onCreateExercise(): void {
    let exerciseId = createExercise();
    addExercise(id, exerciseId);
    let setId = createSet();
    addSet(exerciseId, setId);
  }

  function onSetWorkoutName(text: string): void {
    setName(text, id);
  }

  function onExercisePresetClick(preset: ExercisePreset) {
    if (selectSheetId === undefined) return;
    //setExerciseName(selectSheetId, preset.name);
    setExerciseId(selectSheetId, preset.id);
    setSelectSheetId(undefined);
  }

  function onToggleLocked(): void {
    if (exerciseSheetId !== undefined) {
      setExerciseSheetId(undefined);
    }
    toggleLocked(id);
  }

  function onExerciseSheetChange(index: number): void {
    // if index is -1 then it is closed
    if (index === -1) {
      setExerciseSheetId(undefined);
    }
  }

  function onSelectSheetChange(index: number): void {
    // if index is -1 then it is closed
    if (index === -1) {
      setSelectSheetId(undefined);
    }
  }

  function onAddSet(): void {
    if (exerciseSheetId !== undefined) {
      addSet(exerciseSheetId, createSet());
    }
  }

  function onRemoveSet(): void {
    if (exerciseSheetId !== undefined) {
      let setId = popSet(exerciseSheetId);
      if (setId !== undefined) {
        deleteSet(setId);
      }
      let setsLen = getExercise(exerciseSheetId).setIds.length;
      if (setsLen === 0) {
        addSet(exerciseSheetId, createSet());
      }
    }
  }

  function onDeleteExercise() {
    if (exerciseSheetId === undefined) {
      return;
    }
    removeExercise(id, exerciseSheetId);
    deleteExercise(exerciseSheetId);
    setExerciseSheetId(undefined);
  }

  function closeExerciseSheet() {
    setExerciseSheetId(undefined);
  }

  function onMoveUp() {
    if (exerciseSheetId === undefined) {
      return;
    }
    moveUp(id, exerciseSheetId);
  }

  function onMoveDown() {
    if (exerciseSheetId === undefined) {
      return;
    }
    moveDown(id, exerciseSheetId);
  }

  function validExercisePresetIds(): boolean {
    for (let i = 0; i < workout.exerciseIds.length; ++i) {
      const isUndefined =
        getExercise(workout.exerciseIds[i]).presetId === undefined;
      if (isUndefined) return false;
    }
    return true;
  }

  async function onFinishWorkout() {
    if (validExercisePresetIds() === false) {
      console.error("Missing exercise preset ids. (choose a workout name)");
      return;
    }

    if (workout.templateId === undefined) {
      const templateId = await createNewTemplate(db);
      setTemplateId(workout.id, templateId);
      workout.templateId = templateId;
    }
    setPerformed(new Date(), workout.id);

    let sessionId = await saveWorkoutSession(db, workout);
    // console.log()
    for (let i = 0; i < workout.exerciseIds.length; ++i) {
      let exercise = getExercise(workout.exerciseIds[i]);
      let exerciseId = await saveExercise(db, exercise, sessionId, i);
      for (let j = 0; j < exercise.setIds.length; ++j) {
        let set = getSet(exercise.setIds[j]);
        await saveSet(db, set, exerciseId, j);
        resetSet(set.id);
      }
    }
    removeInProgress(id);
    addLoadedIfNotExists(id);
    router.navigate(ROUTES.templates);
  }

  function onCancelWorkout() {
    setShowModal(true);
  }

  function onSearchPreset(
    input: NativeSyntheticEvent<TextInputTextInputEventData>,
  ) {
    const re = new RegExp(`.*${input.nativeEvent.text}.*`, "i");
    let list = presets.filter((item) => re.test(item.name));
    setFilteredExercisedPresets(list);
  }

  useEffect(() => {
    if (exerciseSheetId !== undefined && !isLocked) {
      exerciseSheetRef.current?.present();
    } else {
      exerciseSheetRef.current?.close();
    }
  }, [exerciseSheetId]);

  useEffect(() => {
    if (selectSheetId !== undefined && !isLocked) {
      selectSheetRef.current?.present();
    } else {
      selectSheetRef.current?.close();
    }
  }, [selectSheetId]);

  useEffect(() => {
    setExerciseSheetId(undefined);
    setSelectSheetId(undefined);

    const backHander = BackHandler.addEventListener("hardwareBackPress", () => {
      if (
        exerciseSheetId !== undefined ||
        selectSheetId !== undefined ||
        showModal
      ) {
        setExerciseSheetId(undefined);
        setSelectSheetId(undefined);
        setShowModal(false);
      } else {
        onCancelWorkout();
      }
      return true;
    });

    return () => backHander.remove();
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
            <TouchableOpacity onPress={onToggleLocked} style={styles.lock}>
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
              <View style={styles.listFooter}>
                {!isLocked && (
                  <Submit
                    touchableProps={{ onPress: onCreateExercise }}
                    btnProps={{
                      primaryColor: scheme.quaternary,
                      text: "NEW EXERCISE",
                      variant: ButtonVariant.Filled,
                      secondaryColor: scheme.primary,
                    }}
                  />
                )}
                <Submit
                  touchableProps={{ onPress: onFinishWorkout }}
                  btnProps={{
                    text: "FINISH WORKOUT",
                    variant: ButtonVariant.Filled,
                    primaryColor: scheme.secondary,
                    secondaryColor: scheme.tertiary,
                  }}
                />
                <Submit
                  touchableProps={{ onPress: onCancelWorkout }}
                  btnProps={{
                    text: "CANCEL WORKOUT",
                    variant: ButtonVariant.Filled,
                    primaryColor: scheme.primary,
                    secondaryColor: scheme.quaternary,
                  }}
                />
              </View>
            }
            ListFooterComponentStyle={styles.addExercise}
          />
        </View>
        {/* Cancel workout modal */}
        <Modal
          hidden={!showModal}
          zIndex={10}
          opacity={1}
          bgColor={"rgba(0, 0, 0, 0.2)"}
          onPress={() => setShowModal(false)}
        >
          <View style={[styles.cancelContainer, calcStyle.cancelContainer]}>
            <Text style={[styles.cancelHeaderText, calcStyle.cancelText]}>
              Cancel Workout?
            </Text>
            <Text style={[styles.cancelText, calcStyle.cancelText]}>
              All progress will be lost.
            </Text>
            <View style={styles.yesNoContainer}>
              <TouchableOpacity style={[styles.yesAndNowContainer]}>
                <Text style={[styles.yesNoText, calcStyle.noText]}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.yesAndNowContainer, calcStyle.yesContainer]}
              >
                <Text style={[styles.yesNoText, calcStyle.yesText]}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal for bottom sheets */}
        <Modal
          hidden={exerciseSheetId === undefined}
          zIndex={0}
          opacity={0.2}
          onPress={closeExerciseSheet}
        />

        <BottomSheetModal
          ref={selectSheetRef}
          snapPoints={["100%"]}
          onChange={onSelectSheetChange}
          backgroundStyle={[
            styles.selectBottomSheet,
            calcStyle.bottomSheetContainer,
          ]}
          handleIndicatorStyle={{ backgroundColor: scheme.loPrimary }}
        >
          {/* Exercise Presets */}
          <BottomSheetFlatList
            data={filteredExercisedPresets}
            stickyHeaderIndices={[0]}
            ListHeaderComponent={
              <View style={[styles.searchContainer, calcStyle.searchContainer]}>
                <Ionicons name="search" size={30} color={scheme.loPrimary} />
                <TextInput
                  style={[styles.searchInput, calcStyle.searchInput]}
                  onTextInput={onSearchPreset}
                  multiline={true}
                />
              </View>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => onExercisePresetClick(item)}
              >
                <Text style={[styles.exercisePreset, calcStyle.exercisePreset]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            ListFooterComponent={<View />}
            ListFooterComponentStyle={{ paddingBottom: 90 }}
          />
        </BottomSheetModal>

        {/* Modal bottom sheet */}
        <BottomSheetModal
          ref={exerciseSheetRef}
          snapPoints={["48%"]}
          onChange={onExerciseSheetChange}
          backgroundStyle={[calcStyle.bottomSheetContainer]}
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
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerText: {
    flex: 13,
    height: 40,
    paddingHorizontal: 6,
    borderRadius: 5,
    fontFamily: "PermanentMarker",
    fontSize: 26,
  },
  lock: {
    flex: 1,
    paddingLeft: 10,
  },
  addExercise: {
    alignItems: "center",
    paddingTop: 30,
    marginBottom: 300,
  },
  listFooter: {
    gap: 20,
  },
  cancelContainer: {
    borderRadius: 15,
    padding: 15,
    width: "95%",
    height: "60%",
    maxWidth: 300,
    maxHeight: 200,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  cancelHeaderText: {
    fontFamily: "Oswald",
    fontSize: 25,
  },
  cancelText: {
    fontFamily: "Oswald",
    fontSize: 16,
    paddingBottom: 15,
  },
  yesNoContainer: {
    flexDirection: "row",
    gap: 15,
  },
  yesNoText: {
    fontFamily: "Oswald",
    fontSize: 16,
  },
  yesAndNowContainer: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  selectBottomSheet: {
    borderRadius: 0,
  },
  selectBottomSheetView: {
    width: "100%",
    height: "100%",
  },
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
    fontFamily: "Oswald",
    fontSize: 15,
  },
  exercisePreset: {
    fontFamily: "Oswald",
    fontSize: 18,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 20,
    marginVertical: 2,
    marginHorizontal: 20,
  },
  searchContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    gap: 4,
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 10,
    flex: 1,
    padding: 3,
  },
  searchInput: {
    fontFamily: "Oswald",
    fontSize: 17,
    flex: 1,
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
      color: isLocked ? scheme.primary : scheme.tertiary,
    },
    cancelContainer: {
      backgroundColor: scheme.secondary,
    },
    cancelText: {
      color: scheme.tertiary,
    },
    yesText: {
      color: scheme.primary,
    },
    noText: {
      color: scheme.loPrimary,
    },
    yesContainer: {
      backgroundColor: scheme.quaternary,
    },
    bottomSheetContainer: {
      backgroundColor: scheme.hiPrimary,
    },
    sheetText: {
      color: scheme.tertiary,
    },
    exercisePreset: {
      color: scheme.tertiary,
      // backgroundColor: scheme.hiPrimary,
    },
    searchContainer: {
      backgroundColor: scheme.hiPrimary,
      borderColor: scheme.loPrimary,
    },
    searchInput: {
      color: scheme.tertiary,
    },
  });
