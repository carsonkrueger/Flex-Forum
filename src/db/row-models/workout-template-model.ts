import { SQLiteDatabase } from "expo-sqlite";
import { WorkoutSessionRow } from "./workout-model";

export type WorkoutTemplate = {
  id: number;
  disabled: boolean;
};

export async function createNewTemplate(db: SQLiteDatabase): Promise<number> {
  let res = await db.runAsync(
    "INSERT INTO WorkoutTemplates DEFAULT VALUES;",
    [],
  );
  return res.lastInsertRowId;
}

export async function disableTemplate(
  db: SQLiteDatabase,
  id: number,
): Promise<void> {
  let res = await db.runAsync(
    "UPDATE WorkoutTemplates SET disabled = true WHERE id = ?;",
    [id],
  );
  console.log(res.changes);
}
