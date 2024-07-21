import client from "@/util/web-client";

export type ExercisePresetModel = {
  name: string;
  description: string | undefined;
};

export const getAllExercisePresets = () =>
  client.get<ExercisePresetModel[]>("/exercise-presets");
