import ContentModel, {
  downloadContent,
  WorkoutSummary,
} from "@/models/content-model";
import useSettingsStore from "@/stores/settings";
import { ColorScheme } from "@/util/colors";
import { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import useWorkoutStore from "@/stores/workout";
import useExerciseStore from "@/stores/exercises";
import useSetStore from "@/stores/sets";

export type Props = {
  contentModel: ContentModel;
  width: number;
  aspectRatio?: number;
};

export default function PostImage({
  contentModel,
  width,
  aspectRatio = 1,
}: Props) {
  const scheme = useSettingsStore((state) => state.colorScheme);
  const [workout, setWorkout] = useState<WorkoutSummary | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const calcStyle = useMemo(() => calcStyles(width, scheme), [width, scheme]);
  const createWorkout = useWorkoutStore((s) => s.createWorkout);
  const addLoaded = useWorkoutStore((s) => s.addLoadedIfNotExists);
  const setWorkoutName = useWorkoutStore((s) => s.setName);
  const addExercise = useWorkoutStore((s) => s.addExercise);
  const createExercise = useExerciseStore((s) => s.createExercise);
  const setExerciseName = useExerciseStore((s) => s.setName);
  const addSet = useExerciseStore((s) => s.addSet);
  const createSet = useSetStore((s) => s.createSet);
  const setPrev = useSetStore((s) => s.setPrev);
  // const setExerciseName = useExerciseStore(s => s.);

  const saveNewWorkout = () => {
    if (!workout) return;
    setSaved(!saved);
    let workoutId = createWorkout();
    setWorkoutName(workout.workout_name, workoutId);

    // exercises
    for (let i = 0; i < workout.exercises.length; i++) {
      let exerciseId = createExercise();
      setExerciseName(exerciseId, workout.exercises[i].exercise_name);
      addExercise(workoutId, exerciseId);

      // sets
      for (let j = 0; j < workout.exercises[i].num_sets; j++) {
        let setId = createSet();
        addSet(exerciseId, setId);
        // prev reps
        setPrev(undefined, workout.exercises[i].num_reps, setId);
      }
    }

    addLoaded(workoutId);
  };

  useEffect(() => {
    if (workout != null) return;

    downloadContent<WorkoutSummary>(contentModel, "json").then((data) => {
      setWorkout(data);
    });
  }, []);

  return (
    <View>
      {workout && (
        <>
          <View style={[styles.body, calcStyle.body]}>
            {/* Workout Name */}
            <Text
              style={[
                styles.roundItem,
                calcStyle.exercise,
                calcStyle.workoutName,
              ]}
            >
              {workout.workout_name}
            </Text>
            {/* Exercises */}
            {workout.exercises.map((e, idx) => (
              <View
                key={`ex.${contentModel.post_id}.${idx}`}
                style={[styles.roundItem, calcStyle.exercise]}
              >
                <Text style={[styles.exerciseText, calcStyle.exerciseText]}>
                  {e.exercise_name}
                </Text>
                <Text style={[styles.exerciseText, calcStyle.exerciseText]}>
                  {e.num_sets}x{e.num_reps}
                </Text>
              </View>
            ))}
            <TouchableOpacity
              style={[styles.roundItem, calcStyle.save]}
              activeOpacity={0.7}
              onPress={saveNewWorkout}
            >
              <Feather
                name={`${saved ? "check" : "save"}`}
                size={15}
                color={scheme.tertiary}
              />
              <Text style={[calcStyle.saveText]}>
                {saved ? "Saved" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const calcStyles = (width: number, scheme: ColorScheme) =>
  StyleSheet.create({
    body: {
      width: width,
    },
    workoutName: {
      backgroundColor: scheme.tertiary,
      color: scheme.primary,
    },
    exercise: {
      backgroundColor: scheme.quaternary,
    },
    exerciseText: {
      color: scheme.primary,
    },
    save: {
      backgroundColor: scheme.hiSecondary,
    },
    saveText: {
      color: scheme.tertiary,
    },
  });

const styles = StyleSheet.create({
  body: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    padding: 10,
  },
  roundItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    maxWidth: 200,
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 14,
  },
  exerciseText: {},
});
