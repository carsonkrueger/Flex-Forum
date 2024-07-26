import { SQLiteDatabase } from "expo-sqlite";
import migrate1 from "./migrations/071724_01_init";
import {
  dropAllTables,
  getDBVersion,
  listAllTableNames,
  setDBVersion,
} from "./base";

const migrations = [migrate1];

export async function migrateAll(db: SQLiteDatabase) {
  // await dropAllTables(db);
  // console.log(await listAllTableNames(db));
  let version = await getDBVersion(db);
  console.log(`DB version: ${version}`);
  if (version === undefined)
    return console.error("Migration Error: DB version undefined");

  // version = 0;

  for (let i = 0; i < migrations.length; ++i) {
    let success = await migrations[i](db, version);
    if (success) {
      await setDBVersion(db, ++version);
      console.log(`Upgraded DB to version: ${version}`);
    }
  }
}
