import { supabase } from "../config/supabase";
import type { Parent } from "../config/config";
import type { Student } from "../config/config";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
export async function RegisterParentAndStudent(
  parent: Parent,
  students: Student[]
) {
  parent.password = await bcrypt.hash(nanoid(10), 10);
  const studentsWithPasswords = students.map(async (s) => ({
    ...s,
    password: await bcrypt.hash(nanoid(10), 10)
  }));
  const { data: parentData, error: parentError } = await supabase
    .from("parents")
    .insert([parent])
    .select();
  if (parentError || !parentData?.length) {
    console.error("Error inserting parent:", parentError);
    return;
  }
  const parentId = parentData[0].id;
  const { data: studentData, error: studentError } = await supabase
    .from("students")
    .insert(studentsWithPasswords)
    .select();

  if (studentError || !studentData?.length) {
    console.error("Error inserting students:", studentError);
    return;
  }
  const parentStudentRelations = studentData.map((s) => ({
    parent_id: parentId,
    student_id: s.id,
  }));
  const { error: relationError } = await supabase
    .from("relationships")
    .insert(parentStudentRelations);
  if (relationError) {
    console.error("Error inserting parent-student relation:", relationError);
    return;
  }

  return { parent: parentData[0], students: studentData };
}
