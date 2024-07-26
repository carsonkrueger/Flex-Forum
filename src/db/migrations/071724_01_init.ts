import { SQLiteDatabase } from "expo-sqlite";
import { setDBVersion } from "../base";

export default async function migrate(db: SQLiteDatabase, version: number) {
  if (version != 0) return false;
  await db.execAsync(
    `
    CREATE TABLE IF NOT EXISTS WorkoutTemplates (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ExercisePresets (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS WorkoutSessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      templateId INTEGER NOT NULL,
      name TEXT NOT NULL,
      performed DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (templateId) REFERENCES WorkoutTemplates(id)
    );

    CREATE TABLE IF NOT EXISTS Exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      sessionId INTEGER NOT NULL,
      exercisePresetId INTEGER NOT NULL,
      idx INTEGER NOT NULL,
      timer INTEGER DEFAULT NULL,
      FOREIGN KEY (sessionId) REFERENCES WorkoutSessions(id),
      FOREIGN KEY (exercisePresetId) REFERENCES ExercisePresets(id)
    );

    CREATE TABLE IF NOT EXISTS Sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      exerciseId INTEGER NOT NULL,
      idx INTEGER NOT NULL,
      weight INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      FOREIGN KEY (exerciseId) REFERENCES Exercises(id)
    );

    CREATE INDEX IF NOT EXISTS WorkoutTemplateIdIndex ON WorkoutSessions(templateId);

    CREATE UNIQUE INDEX IF NOT EXISTS WorkoutSessionPerformedIndex ON WorkoutSessions(performed);

    CREATE INDEX IF NOT EXISTS ExercisesSessionIdIndex ON Exercises(sessionId);

    CREATE INDEX IF NOT EXISTS SetsExerciseIdIndex ON Sets(exerciseId);
    `,
  );

  return true;
}
