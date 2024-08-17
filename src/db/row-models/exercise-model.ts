import { Exercise } from "@/stores/workout";
import { SQLiteDatabase } from "expo-sqlite";

export type ExerciseRow = {
  id: number;
  sessionId: number;
  exercisePresetId: number;
  idx: number;
  timer?: number;
};

export async function saveExercise(
  db: SQLiteDatabase,
  exercise: Exercise,
  sessionId: number,
  idx: number,
): Promise<number> {
  let res = await db.runAsync(
    "INSERT INTO Exercises(sessionId, exercisePresetId, idx, timer) VALUES (?, ?, ?, ?);",
    [sessionId, exercise.presetId ?? 0, idx, exercise.timerDuration ?? null],
  );
  return res.lastInsertRowId;
}

export async function getExerciseRows(
  db: SQLiteDatabase,
  sessionId: number,
): Promise<ExerciseRow[]> {
  return await db.getAllAsync<ExerciseRow>(
    "SELECT id, sessionId, exercisePresetId, idx, timer FROM Exercises WHERE sessionId = ? ORDER BY idx ASC;",
    [sessionId],
  );
}
