import { openDatabaseSync } from "expo-sqlite";

const databaseName = "FlexForum" as const;

const db = openDatabaseSync(databaseName);

export default db;
