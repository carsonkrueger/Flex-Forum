import { SQLiteDatabase } from "expo-sqlite";
import { setDBVersion } from "../base";

export default async function migrate(db: SQLiteDatabase, version: number) {
  if (version != 0) return;
  await db.execAsync(
    `
    CREATE TABLE IF NOT EXISTS ExercisePresets (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS WorkoutSessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name TEXT NOT NULL,
      performed DATETIME DEFAULT datetime('now')
    );

    CREATE TABLE IF NOT EXISTS Exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      sessionId INTEGER NOT NULL,
      exercisePresetId INTEGER NOT NULL,
      idx INTEGER NOT NULL,
      FOREIGN KEY (sessionId) REFERENCES WorkoutsSessions(id),
      FOREIGN KEY (exercisePresetId) REFERENCES ExercisePresets(id)
    );

    CREATE TABLE IF NOT EXISTS Sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      sessionId INTEGER NOT NULL,
      exerciseId INTEGER NOT NULL,
      idx INTEGER NOT NULL,
      weight INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      FOREIGN KEY (sessionId) REFERENCES WorkoutSessions(id),
      FOREIGN KEY (exerciseId) REFERENCES Exercises(id)
    );

    CREATE UNIQUE INDEX IF NOT EXISTS WorkoutSessionIdIndex ON WorkoutSessions(id);

    CREATE UNIQUE INDEX IF NOT EXISTS WorkoutSessionPerformedIndex ON WorkoutSessions(performed);

    CREATE UNIQUE INDEX IF NOT EXISTS ExercisePresetsIdIndex ON ExercisePresets(id);

    CREATE UNIQUE INDEX IF NOT EXISTS ExercisesIdIndex ON Exercises(id);

    CREATE UNIQUE INDEX IF NOT EXISTS SetsIdIndex ON Sets(id);
    `,
  );

  await setDBVersion(db, ++version);

  return version;
}
