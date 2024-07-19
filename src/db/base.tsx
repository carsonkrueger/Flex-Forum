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
