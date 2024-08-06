import Template from "@/components/workout/Template";
import Submit, { ButtonVariant } from "@/forms/Submit";
import { getExerciseRows } from "@/db/row-models/exercise-model";
import { getSetRows } from "@/db/row-models/set-model";
import { getAllTemplates } from "@/db/row-models/workout-model";
import useSettingsStore from "@/stores/settings";
import useWorkoutStore from "@/stores/workout";
import { ColorScheme } from "@/util/colors";
import { ROUTES } from "@/util/routes";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useMemo, useRef } from "react";
import { Text, ScrollView, StyleSheet, View } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Modal from "@/components/modal";
import {
  WorkoutSummary,
  ExerciseSummary,
  uploadWorkout,
  WorkoutPost,
} from "@/models/content-model";
import {
  createNewTemplate,
  disableTemplate,
} from "@/db/row-models/workout-template-model";

const WORKOUT_QUERY_LIMIT = 100 as const;

export default function Page() {
  const router = useRouter();
  const db = useSQLiteContext();
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme]);
  const createExercise = useWorkoutStore((s) => s.createExercise);
  const addExercise = useWorkoutStore((s) => s.addExercise);
  const createWorkout = useWorkoutStore((s) => s.createWorkout);
  const loadFromWorkoutRow = useWorkoutStore((s) => s.insertFromRow);
  const createFromExerciseRow = useWorkoutStore((s) => s.createFromRow);
  const addSet = useWorkoutStore((s) => s.addSet);
  const createSet = useWorkoutStore((s) => s.createSet);
  const createFromSetRow = useWorkoutStore((s) => s.createFromSetRow);
  const addInProgress = useWorkoutStore((s) => s.addInProgress);
  const inProgress = useWorkoutStore((s) => s.inProgress);
  const loaded = useWorkoutStore((s) => s.loaded);
  const offset = useWorkoutStore((s) => s.templateOffset);
  const getWorkout = useWorkoutStore((s) => s.getWorkout);
  const getExercise = useWorkoutStore((s) => s.getExercise);
  const getSet = useWorkoutStore((s) => s.getSet);
  const templateSheetId = useWorkoutStore((s) => s.templateSheetId);
  const setTemplateSheetId = useWorkoutStore((s) => s.setTemplateSheetId);
  const setOffset = useWorkoutStore((s) => s.setTemplateOffset);
  const sheetRef = useRef<BottomSheetModal>(null);
  const deleteWorkout = useWorkoutStore((s) => s.deleteWorkout);
  const deleteExercise = useWorkoutStore((s) => s.deleteExercise);
  const deleteSet = useWorkoutStore((s) => s.deleteSet);
  const isInProgress = useWorkoutStore((s) => s.isInProgress);
  const removeLoaded = useWorkoutStore((s) => s.removeLoaded);

  const createNewWorkout = async () => {
    const wid = createWorkout(undefined);
    const eid = createExercise();
    addExercise(wid, eid);
    const sid = createSet();
    addSet(eid, sid);
    addInProgress(wid);
    router.push({ pathname: ROUTES.workout(wid) });
  };

  const fetchWorkouts = () => {
    getAllTemplates(db).then(async (workoutRows) => {
      for (let i = 0; i < workoutRows.length; ++i) {
        let wId = await loadFromWorkoutRow(db, workoutRows[i]);
      }
      // for (let i = 0; i < workoutRows.length; ++i) {
      //   let workoutId = loadFromWorkoutRow(workoutRows[i]);
      //   let exerciseRows = await getExerciseRows(db, workoutRows[i].id);
      //   for (let j = 0; j < exerciseRows.length; ++j) {
      //     let exerciseId = createFromExerciseRow(exerciseRows[j]);
      //     let setRows = await getSetRows(db, exerciseRows[j].id);
      //     addExercise(workoutId, exerciseId);
      //     for (let k = 0; k < setRows.length; ++k) {
      //       let setId = createFromSetRow(setRows[k]);
      //       addSet(exerciseId, setId);
      //     }
      //   }
      // }
    });
    setOffset(offset + WORKOUT_QUERY_LIMIT);
  };

  const onSheetChange = (index: number) => {
    if (index === -1) {
      setTemplateSheetId(undefined);
    }
  };

  const onModalClick = () => {
    setTemplateSheetId(undefined);
  };

  const onShareWorkout = async () => {
    if (templateSheetId === undefined) return;
    let wSummary: WorkoutSummary = { workout_name: "", exercises: [] };
    const workout = getWorkout(templateSheetId);
    wSummary.workout_name = workout.name;
    for (let i = 0; i < workout.exerciseIds.length; ++i) {
      let eSummary: ExerciseSummary = {
        preset_id: 0,
        num_sets: 1,
        num_reps: 1,
        timer: undefined,
      };
      const exercise = getExercise(workout.exerciseIds[i]);
      eSummary.preset_id = exercise.presetId ?? 0;
      eSummary.num_sets = exercise.setIds.length;
      eSummary.timer = exercise.timerDuration;
      if (exercise.setIds.length > 0) {
        const firstSet = getSet(exercise.setIds[0]);
        eSummary.num_reps = firstSet.reps ?? 1;
      }
      wSummary.exercises.push(eSummary);
    }
    const post: WorkoutPost = { workout: wSummary, description: "" };
    await uploadWorkout(post);
  };

  const onDeleteWorkout = () => {
    if (templateSheetId === undefined) return;
    let workout = getWorkout(templateSheetId);
    // only loaded workouts can be delete, not in progress workouts
    if (isInProgress(workout.id)) return;
    setTemplateSheetId(undefined);
    removeLoaded(workout.id);
    console.log(loaded);

    if (workout.templateId !== undefined) {
      disableTemplate(db, workout.templateId!);
    } else console.error(workout);
    deleteWorkout(workout.id);
    for (let i = 0; i < workout.exerciseIds.length; ++i) {
      let exercise = getExercise(workout.exerciseIds[i]);
      deleteExercise(exercise.id);
      for (let j = 0; j < exercise.setIds.length; ++j) {
        let set = getSet(exercise.setIds[j]);
        deleteSet(set.id);
      }
    }
  };

  useEffect(() => {
    if (templateSheetId !== undefined) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.close();
    }
  }, [templateSheetId]);

  useEffect(() => {
    setTemplateSheetId(undefined);
    if (offset === 0) fetchWorkouts();
    getAllTemplates(db);
  }, []);

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <ScrollView
          contentContainerStyle={{ alignItems: "center" }}
          style={[styles.container, calcStyle.container]}
        >
          <Text style={[styles.headerText, calcStyle.headerText]}>
            Workouts
          </Text>

          {inProgress.length > 0 && (
            <Text style={[styles.subHeaderText, calcStyle.subHeaderText]}>
              In Progress
            </Text>
          )}

          {inProgress.toReversed().map((id) => (
            <Template key={`inprogress.${id}`} id={id} />
          ))}

          <Submit
            btnProps={{
              text: "NEW WORKOUT",
              primaryColor: scheme.primary,
              secondaryColor: scheme.quaternary,
              variant: ButtonVariant.Filled,
            }}
            touchableProps={{ onPress: createNewWorkout }}
          />

          {loaded.length > 0 && (
            <Text style={[styles.subHeaderText, calcStyle.subHeaderText]}>
              My Workouts
            </Text>
          )}

          {loaded.map((id) => (
            <Template key={`workout.${id}`} id={id} />
          ))}

          {/* Empty view used for bottom padding */}
          <View style={{ paddingVertical: 60 }} />

          <Modal
            hidden={templateSheetId === undefined}
            zIndex={0}
            opacity={0}
            onPress={onModalClick}
          />

          <BottomSheetModal
            ref={sheetRef}
            snapPoints={["40%"]}
            onChange={onSheetChange}
            backgroundStyle={[
              // styles.selectBottomSheet,
              calcStyle.bottomSheetContainer,
            ]}
            handleIndicatorStyle={{ backgroundColor: scheme.loPrimary }}
          >
            <BottomSheetView style={styles.sheetContainer}>
              <Submit
                btnProps={{
                  primaryColor: scheme.quaternary,
                  secondaryColor: scheme.loPrimary,
                  text: "Share to Profile",
                  variant: ButtonVariant.Filled,
                }}
                touchableProps={{ onPress: onShareWorkout }}
              />
              {templateSheetId !== undefined &&
                !isInProgress(templateSheetId) && (
                  <Submit
                    btnProps={{
                      primaryColor: scheme.hiPrimary,
                      secondaryColor: scheme.quaternary,
                      text: "Delete Workout",
                      variant: ButtonVariant.Filled,
                    }}
                    touchableProps={{ onPress: onDeleteWorkout }}
                  />
                )}
            </BottomSheetView>
          </BottomSheetModal>
        </ScrollView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontFamily: "PermanentMarker",
    fontSize: 25,
  },
  subHeaderText: {
    fontFamily: "Oswald",
    fontSize: 15,
    width: "100%",
  },
  sheetContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },
});

const calcStyles = (scheme: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: scheme.primary,
    },
    headerText: {
      color: scheme.tertiary,
    },
    subHeaderText: {
      color: scheme.hiSecondary,
    },
    bottomSheetContainer: {
      backgroundColor: scheme.hiPrimary,
    },
  });
