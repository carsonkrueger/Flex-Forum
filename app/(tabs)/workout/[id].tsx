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
  TextInputTextInputEventData,
  NativeSyntheticEvent,
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
import { routes } from "@/util/routes";
import { saveWorkoutSession } from "@/db/models/workout-model";
import { saveExercise } from "@/db/models/exercise-model";
import { saveSet } from "@/db/models/set-model";
import { useSQLiteContext } from "expo-sqlite";
import {
  ExercisePresetModel,
  getAllExercisePresets,
} from "@/models/exercise-preset-model";

export default function Page() {
  const db = useSQLiteContext();
  const id = (useLocalSearchParams<{ id: string }>().id ?? -1) as number;
  const router = useRouter();
  const scheme = useSettingsStore((state) => state.colorScheme);
  const isLocked = useWorkoutStore((s) => s.workouts[id].isLocked);
  const toggleLocked = useWorkoutStore((s) => s.toggleLocked);
  const workout = useWorkoutStore((s) => s.workouts[id]);
  const removeInProgress = useWorkoutStore((s) => s.removeInProgress);
  const addLoadedIfNotExists = useWorkoutStore((s) => s.addLoadedIfNotExists);
  const addExercise = useWorkoutStore((s) => s.addExercise);
  const removeExercise = useWorkoutStore((s) => s.removeExercise);
  const createExercise = useExerciseStore((s) => s.createExercise);
  const deleteExercise = useExerciseStore((s) => s.deleteExercise);
  const moveUp = useWorkoutStore((s) => s.moveUp);
  const moveDown = useWorkoutStore((s) => s.moveDown);
  const getExercise = useExerciseStore((s) => s.getExercise);
  const resetSet = useSetStore((s) => s.resetSet);
  const getSet = useSetStore((s) => s.getSet);
  const addSet = useExerciseStore((s) => s.addSet);
  const popSet = useExerciseStore((s) => s.popSet);
  const createSet = useSetStore((s) => s.createSet);
  const deleteSet = useSetStore((s) => s.deleteSet);
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
  const setExerciseName = useExerciseStore((s) => s.setName);
  const [filteredExercisedPresets, setFilteredExercisedPresets] = useState<
    ExercisePresetModel[]
  >([]);
  const exercisePresets = useRef<ExercisePresetModel[]>([]);

  function onCreateExercise(): void {
    let exerciseId = createExercise();
    addExercise(id, exerciseId);
    let setId = createSet();
    addSet(exerciseId, setId);
  }

  function onSetWorkoutName(text: string): void {
    setName(text, id);
  }

  function onExercisePresetClick(preset: ExercisePresetModel) {
    if (selectSheetId === undefined) return;
    setExerciseName(selectSheetId, preset.name);
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

  async function onFinishWorkout() {
    let sessionId = await saveWorkoutSession(db, workout);
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
    router.navigate(routes.templates);
  }

  function onSearchPreset(
    input: NativeSyntheticEvent<TextInputTextInputEventData>,
  ) {
    const re = new RegExp(`.*${input.nativeEvent.text}.*`, "i");
    let list = exercisePresets.current.filter((item) => re.test(item.name));
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
    console.log("get exercises");
    setExerciseSheetId(undefined);
    setSelectSheetId(undefined);
    getAllExercisePresets().then(({ data }) => {
      exercisePresets.current = data;
      setFilteredExercisedPresets(data);
    });
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
                  touchableProps={{ onPress: onFinishWorkout }}
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
        {/* Modal */}
        <Modal
          hidden={exerciseSheetId === undefined}
          zIndex={0}
          opacity={0}
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
    fontSize: 15,
  },
  exercisePreset: {
    borderRadius: 10,
    fontSize: 18,
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
    bottomSheetContainer: {
      backgroundColor: scheme.primary,
    },
    sheetText: {
      color: scheme.tertiary,
    },
    exercisePreset: {
      color: scheme.tertiary,
      backgroundColor: scheme.hiPrimary,
    },
    searchContainer: {
      backgroundColor: scheme.primary,
      borderColor: scheme.loPrimary,
    },
    searchInput: {
      color: scheme.tertiary,
    },
  });
