import client from "@/util/web-client";
import { ResponseType } from "axios";
import { PostType } from "./post-model";

export default interface ContentModel {
  username: string;
  post_id: number;
  content_id: number;
  post_type: PostType;
}

export interface ExerciseSummary {
  preset_id: number;
  num_sets: number;
  num_reps: number;
  timer?: number;
}

export interface WorkoutSummary {
  workout_name: string;
  exercises: ExerciseSummary[];
}

export interface WorkoutPost {
  workout: WorkoutSummary;
  description?: string;
}

export const downloadContent = <T>(
  model: ContentModel,
  responseType?: ResponseType,
): Promise<T> =>
  client
    .get<T>(
      `/content/${model.post_type}/${model.username}/${model.post_id}/${model.content_id}`,
      { responseType: responseType, timeout: 3000 },
    )
    .then((res) => res.data);

export const uploadWorkout = (workout: WorkoutPost) =>
  client.post(`/content/workouts`, workout);
