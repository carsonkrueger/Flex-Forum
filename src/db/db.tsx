import { openDatabaseSync } from "expo-sqlite";
import { getDBVersion } from "./base";
import migrate1 from "./migrations/071724_01_init";

export const DATABASE_NAME = "FlexForum" as const;
//const db = openDatabaseSync(databaseName);
//export default db;
