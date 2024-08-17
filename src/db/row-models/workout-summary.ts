import { SQLiteDatabase } from "expo-sqlite";

export type WorkoutSummaryJoin = {
  wId: number;
  templateId: number;
  name: string;
  performed: Date;
  // exercise
  eId: number;
  sessionId: number;
  exercisePresetId: number;
  eIdx: number;
  timer?: number;
  // set
  sId: number;
  exerciseId: number;
  sIdx: number;
  weight: number;
  reps: number;
};

export const getSummaryFromSessionId = async (
  db: SQLiteDatabase,
  sessionId: number,
): Promise<WorkoutSummaryJoin[]> =>
  await db.getAllAsync<WorkoutSummaryJoin>(
    `SELECT *, WorkoutSessions.id as wId, Exercises.id as eId, Exercises.idx as eIdx, Sets.id as sId, Sets.idx as sIdx FROM WorkoutSessions
        JOIN Exercises ON WorkoutSessions.id = Exercises.sessionId
        JOIN Sets ON Exercises.id = Sets.exerciseId
        WHERE WorkoutSessions.id = ?;`,
    [sessionId],
  );
