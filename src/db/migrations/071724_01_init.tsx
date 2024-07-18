import * as SQLite from "expo-sqlite";
import db from "../db";

export default async function migrate() {
  await db.execAsync(
    `
    CREATE TABLE IF NOT EXISTS ExercisePresets(
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name VARCHAR(100) NOT NULL,
      description VARCHAR(1000) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS WorkoutSessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name VARCHAR(100) NOT NULL,
      performed DATETIME DEFAULT datetime('now')
    );

    CREATE TABLE IF NOT EXISTS Exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      sessionId INTEGER FOREIGN KEY REFERENCES WorkoutsSessions(id) NOT NULL,
      exercisePresetId INTEGER FOREIGN KEY REFERENCES ExercisePresets(id) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      sessionId INTEGER FORIEGN KEY REFERENCES WorkoutSessions(id) NOT NULL,
      exerciseId INTEGER FOREIGN KEY REFERENCES Exercises(id) NOT NULL,
      weight INTEGER NOT NULL,
      reps INTEGER NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS WorkoutSessionIdIndex ON WorkoutSessions(id);

    CREATE UNIQUE INDEX IF NOT EXISTS WorkoutSessionPerformedIndex ON WorkoutSessions(performed);

    CREATE UNIQUE INDEX IF NOT EXISTS ExercisePresetsIdIndex ON ExercisePresets(id);

    CREATE UNIQUE INDEX IF NOT EXISTS ExercisesIdIndex ON Exercises(id);

    CREATE UNIQUE INDEX IF NOT EXISTS SetsIdIndex ON Sets(id);
    `,
  );
}
