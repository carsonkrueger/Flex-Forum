import { SQLiteDatabase } from "expo-sqlite";
import { WorkoutSessionRow } from "./workout-model";

export type WorkoutTemplate = {
  id: number;
};

export async function createNewTemplate(db: SQLiteDatabase): Promise<number> {
  let res = await db.runAsync(
    "INSERT INTO WorkoutTemplates DEFAULT VALUES;",
    [],
  );
  return res.lastInsertRowId;
}
