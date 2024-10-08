import Template from "@/components/workout/Template";
import Submit, { ButtonVariant } from "@/forms/Submit";
import { getAllTemplates } from "@/db/row-models/workout-model";
import useSettingsStore from "@/stores/settings";
import useWorkoutStore from "@/stores/workout";
import { ColorScheme } from "@/util/colors";
import { ROUTES } from "@/util/routes";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { disableTemplate } from "@/db/row-models/workout-template-model";
import { getSummaryFromSessionId } from "@/db/row-models/workout-summary";
import { Axios } from "axios";

const WORKOUT_QUERY_LIMIT = 100 as const;

export default function Page() {
  const router = useRouter();
  const db = useSQLiteContext();
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme]);
  const createExercise = useWorkoutStore((s) => s.createExercise);
  const addExercise = useWorkoutStore((s) => s.addExercise);
  const createWorkout = useWorkoutStore((s) => s.createWorkout);
  const resetWorkout = useWorkoutStore((s) => s.resetWorkout);
  const loadFromSummary = useWorkoutStore((s) => s.loadFromSummary);
  const addSet = useWorkoutStore((s) => s.addSet);
  const createSet = useWorkoutStore((s) => s.createSet);
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
  const isInProgress = useWorkoutStore((s) => s.isInProgress);
  const sharedTemplateIds = useWorkoutStore((s) => s.sharedTemplateIds);
  const addSharedTemplateId = useWorkoutStore((s) => s.addShareTemplateId);

  const [isAlreadyShared, setIsAlreadyShared] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createNewWorkout = async () => {
    const wid = createWorkout(undefined);
    const eid = createExercise();
    addExercise(wid, eid);
    const sid = createSet();
    addSet(eid, sid);
    addInProgress(wid);
    router.push({ pathname: ROUTES.workout(wid) });
  };

  const fetchWorkouts = async () => {
    getAllTemplates(db).then(async (workoutRows) => {
      for (let i = 0; i < workoutRows.length; ++i) {
        let summary = await getSummaryFromSessionId(db, workoutRows[i].id);
        loadFromSummary(summary);
      }
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
    if (templateSheetId === undefined || isAlreadyShared || isLoading) return;
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

    try {
      setIsLoading(true);
      await uploadWorkout(post);
    } catch (e) {
      // todo report error
      console.error(e);
      return;
    } finally {
      setIsLoading(false);
    }

    addSharedTemplateId(templateSheetId);
    setIsAlreadyShared(true);
  };

  const onResetWorkout = async () => {
    if (templateSheetId === undefined) return;
    await resetWorkout(templateSheetId, db);
    setTemplateSheetId(undefined);
  };

  const onDeleteWorkout = () => {
    if (templateSheetId === undefined) return;
    let workout = getWorkout(templateSheetId);
    disableTemplate(db, workout.templateId!);
    deleteWorkout(templateSheetId);
    setTemplateSheetId(undefined);
  };

  useEffect(() => {
    if (templateSheetId !== undefined) {
      setIsAlreadyShared(sharedTemplateIds.includes(templateSheetId));
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
                  text: isAlreadyShared ? "Shared" : "Share to Profile",
                  variant: ButtonVariant.Filled,
                }}
                touchableProps={{
                  onPress: onShareWorkout,
                  disabled: isAlreadyShared || isLoading,
                }}
              />
              {templateSheetId !== undefined &&
              !isInProgress(templateSheetId) ? (
                <Submit
                  btnProps={{
                    primaryColor: scheme.hiPrimary,
                    secondaryColor: scheme.quaternary,
                    text: "Delete Workout",
                    variant: ButtonVariant.Filled,
                  }}
                  touchableProps={{ onPress: onDeleteWorkout }}
                />
              ) : (
                <Submit
                  btnProps={{
                    primaryColor: scheme.hiPrimary,
                    secondaryColor: scheme.quaternary,
                    text: "Cancel Workout",
                    variant: ButtonVariant.Filled,
                  }}
                  touchableProps={{ onPress: onResetWorkout }}
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
