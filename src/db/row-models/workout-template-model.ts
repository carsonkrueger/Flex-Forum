import { SQLiteDatabase } from "expo-sqlite";

export type WorkoutTemplate = {
  id: number;
};

export async function getAllTemplates(db: SQLiteDatabase) {
  let res = await db.getAllAsync(
    "SELECT * FROM WorkoutTemplates JOIN ON WorkoutSessions USING (templateId)",
    [],
  );
  console.log(res);
}
