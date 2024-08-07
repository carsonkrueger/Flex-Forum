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
import { useQuery } from "@tanstack/react-query";
import useExercisePresetStore from "@/stores/exercise-presets";

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
  const [saved, setSaved] = useState<boolean>(false);
  const calcStyle = useMemo(() => calcStyles(width, scheme), [width, scheme]);
  const createWorkout = useWorkoutStore((s) => s.createWorkout);
  const addLoaded = useWorkoutStore((s) => s.addLoadedIfNotExists);
  const setWorkoutName = useWorkoutStore((s) => s.setName);
  const getPreset = useExercisePresetStore((s) => s.getPreset);
  const addExercise = useWorkoutStore((s) => s.addExercise);
  const createExercise = useWorkoutStore((s) => s.createExercise);
  //const setExerciseName = useWorkoutStore((s) => s.setName);
  const addSet = useWorkoutStore((s) => s.addSet);
  const createSet = useWorkoutStore((s) => s.createSet);
  const setPrev = useWorkoutStore((s) => s.setPrev);

  const saveNewWorkout = () => {
    if (!query.data) return;
    setSaved(!saved);
    let workoutId = createWorkout();
    setWorkoutName(query.data.workout_name, workoutId);

    // exercises
    for (let i = 0; i < query.data.exercises.length; i++) {
      let exerciseId = createExercise();
      const preset = getPreset(query.data.exercises[i].preset_id);
      //setExerciseName(exerciseId, preset?.name ?? "");
      addExercise(workoutId, exerciseId);

      // sets
      for (let j = 0; j < query.data.exercises[i].num_sets; j++) {
        let setId = createSet();
        addSet(exerciseId, setId);
        // prev reps
        setPrev(undefined, query.data.exercises[i].num_reps, setId);
      }
    }

    addLoaded(workoutId);
  };

  const fetchWorkout = async () => {
    return await downloadContent<WorkoutSummary>(contentModel, "json");
  };

  const query = useQuery({
    queryKey: [`workout.${contentModel.post_id}.${contentModel.content_id}`],
    queryFn: fetchWorkout,
  });

  return (
    <View>
      {query.data && (
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
              {query.data.workout_name}
            </Text>
            {/* Exercises */}
            {query.data.exercises.map((e, idx) => (
              <View
                key={`ex.${contentModel.post_id}.${idx}`}
                style={[styles.roundItem, calcStyle.exercise]}
              >
                <Text style={[styles.exerciseText, calcStyle.exerciseText]}>
                  {getPreset(e.preset_id)?.name ?? ""}
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
              <Text style={[styles.saveText, calcStyle.saveText]}>
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
    fontFamily: "Oswald",
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
  exerciseText: {
    fontFamily: "Oswald",
  },
  saveText: {
    fontFamily: "Oswald",
  },
});
