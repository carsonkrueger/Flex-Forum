import { Workout } from "@/stores/workout";
import { SQLiteDatabase } from "expo-sqlite";

export type WorkoutSessionRow = {
  id: number;
  templateId: number;
  name: string;
  performed: Date;
};

export async function getOneTemplate(
  db: SQLiteDatabase,
  templateId: number,
): Promise<WorkoutSessionRow | null> {
  return await db.getFirstAsync(
    `
      SELECT ws.id, ws.templateId, ws.name, ws.performed
      FROM WorkoutSessions ws
      JOIN WorkoutTemplates wt
      ON ws.templateId = wt.id
      WHERE wt.disabled = false
      AND ws.templateId = ?
      AND ws.performed = (
        SELECT MAX(ws2.performed)
        FROM WorkoutSessions ws2
        WHERE ws2.templateId = ws.templateId
      );
      `,
    [templateId],
  );
}

export async function getAllTemplates(
  db: SQLiteDatabase,
): Promise<WorkoutSessionRow[]> {
  //SELECT ws.id, ws.templateId, ws.name, performed
  // FROM WorkoutSessions ws
  // JOIN (
  //   SELECT id
  //   FROM WorkoutTemplates
  //   WHERE disabled = false
  // ) ls
  // ON ws.templateId = ls.id;
  return await db.getAllAsync(
    `
    SELECT ws.id, ws.templateId, ws.name, ws.performed
    FROM WorkoutSessions ws
    JOIN WorkoutTemplates wt
    ON ws.templateId = wt.id
    WHERE wt.disabled = false
    AND ws.performed = (
      SELECT MAX(ws2.performed)
      FROM WorkoutSessions ws2
      WHERE ws2.templateId = ws.templateId
    );
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
