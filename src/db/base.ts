import { SQLiteDatabase } from "expo-sqlite";
import migrate1 from "./migrations/071724_01_init";

export async function getDBVersion(db: SQLiteDatabase) {
  let res = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version;",
    [],
  );
  return res?.user_version;
}

export async function setDBVersion(db: SQLiteDatabase, version: number) {
  await db.runAsync(`PRAGMA user_version = ${version};`);
}

export async function dropAllTables(db: SQLiteDatabase) {
  await db.execAsync(`
    DROP TABLE IF EXISTS Sets;
    DROP TABLE IF EXISTS Exercises;
    DROP TABLE IF EXISTS WorkoutSessions;
    DROP TABLE IF EXISTS ExercisePresets;
    `);
}

export async function listAllTableNames(
  db: SQLiteDatabase,
): Promise<{ name: string }[]> {
  return await db.getAllAsync(
    "SELECT (name) from sqlite_master WHERE type='table';",
    [],
  );
}
