import { Workout } from "@/stores/workout";
import { SQLiteDatabase } from "expo-sqlite";

export type WorkoutSessionRow = {
  id: number;
  templateId: number;
  name: string;
  performed: Date;
};

export async function getAllTemplates(
  db: SQLiteDatabase,
): Promise<WorkoutSessionRow[]> {
  return await db.getAllAsync(
    `
    SELECT ws.*
    FROM WorkoutSessions ws
    JOIN (
        SELECT templateId, MAX(performed) AS latest_performed
        FROM WorkoutSessions
        GROUP BY templateId
    ) ls
    ON ws.templateId = ls.templateId AND ws.performed = ls.latest_performed;
    `,
    [],
  );
}

export async function getWorkoutSessionRows(
  db: SQLiteDatabase,
  limit: number = 10,
  offset: number = 0,
): Promise<WorkoutSessionRow[]> {
  return await db.getAllAsync<WorkoutSessionRow>(
    "SELECT * FROM WorkoutSessions ORDER BY performed DESC LIMIT ? OFFSET ?;",
    [limit, offset],
  );
}

export async function saveWorkoutSession(
  db: SQLiteDatabase,
  workout: Workout,
): Promise<number> {
  if (workout.templateId === undefined) {
    console.error("templateId cannot be undefined");
    throw Error("templateId cannot be undefined");
  }
  let res = await db.runAsync(
    "INSERT INTO WorkoutSessions(name, templateId) VALUES (?, ?);",
    [workout.name, workout.templateId],
  );
  return res.lastInsertRowId;
}
