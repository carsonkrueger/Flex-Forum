// import db from "./db";
import { SQLiteDatabase } from "expo-sqlite";
import migrate1 from "./migrations/071724_01_init";

export async function getDBVersion(db: SQLiteDatabase) {
  let res = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version;",
    [],
  );
  return res?.user_version;
}

export async function setDBVersion(version: number) {
  await db.runAsync("PRAGMA user_version = ?;", [version]);
}

const migrations = [migrate1];

export async function migrateAll(db: SQLiteDatabase) {
  let version = await getDBVersion(db);
  if (!version) return;

  for (let i = 0; i < migrations.length; ++i) {
    await migrations[i](version);
    await setDBVersion(++version);
  }
}
