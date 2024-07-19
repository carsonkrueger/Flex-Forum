import { SQLiteDatabase } from "expo-sqlite";
import migrate1 from "./migrations/071724_01_init";
import { getDBVersion } from "./base";

const migrations = [migrate1];

export async function migrateAll(db: SQLiteDatabase) {
  let version = await getDBVersion(db);
  console.log(version);
  if (version === undefined) return;

  for (let i = 0; i < migrations.length; ++i) {
    let result = await migrations[i](db, version);
    if (result !== undefined) version = result;
    console.log(version);
  }
}
