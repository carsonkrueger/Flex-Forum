import { Workout } from "@/stores/workout";
import { SQLiteDatabase } from "expo-sqlite";

export type WorkoutRow = {
  id: number;
  name: string;
  performed: Date;
};

export async function getWorkoutSessionRows(
  db: SQLiteDatabase,
  limit: number = 5,
  offset: number = 0,
): Promise<WorkoutRow[]> {
  return await db.getAllAsync<WorkoutRow>(
    "SELECT * FROM WorkoutSessions ORDER BY performed DESC LIMIT ? OFFSET ?;",
    [limit, offset],
  );
}

export async function saveWorkoutSession(
  db: SQLiteDatabase,
  workout: Workout,
): Promise<number> {
  let res = await db.runAsync("INSERT INTO WorkoutSessions(name) VALUES (?);", [
    workout.name,
  ]);
  return res.lastInsertRowId;
}
