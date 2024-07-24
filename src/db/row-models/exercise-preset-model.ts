import { SQLiteDatabase } from "expo-sqlite";

export async function InsertExercisePreset(db: SQLiteDatabase) {
  return await db.prepareAsync(
    "INSERT INTO ExercisePresets(name, description) VALUES (?, ?);",
  );
}
