import useSetStore, { Set } from "@/stores/sets";
import { SQLiteDatabase } from "expo-sqlite";

export type SetRow = {
  id: number;
  exerciseId: number;
  idx: number;
  weight: number;
  reps: number;
};

export async function saveSet(
  db: SQLiteDatabase,
  set: Set,
  exerciseId: number,
  idx: number,
): Promise<number> {
  let res = await db.runAsync(
    "INSERT INTO Sets(exerciseId, idx, weight, reps) VALUES (?, ?, ?, ?);",
    [exerciseId, idx, set.weight ?? 0, set.reps ?? 0],
  );
  return res.lastInsertRowId;
}

export async function getSetRows(
  db: SQLiteDatabase,
  exerciseId: number,
): Promise<SetRow[]> {
  return await db.getAllAsync<SetRow>(
    "SELECT id, exerciseId, idx, weight, reps FROM Sets WHERE exerciseId = ? ORDER BY idx ASC;",
    [exerciseId],
  );
}
