import { supabase } from "../config/supabase";
import type { Parent, Student } from "../config/config";
import bcrypt from "bcrypt";

export async function RegisterParentAndStudent(
  parent: Parent,
  students: Student[]
) {
  // import nanoid แบบ dynamic
  const { nanoid } = await import("nanoid");

  // สร้าง password ให้ parent
  parent.password = await bcrypt.hash(nanoid(10), 10);

  // สร้าง password ให้ students
  const studentsWithPasswords = await Promise.all(
    students.map(async (s) => ({
      ...s,
      password: await bcrypt.hash(nanoid(10), 10),
    }))
  );

  // insert parent
  const { data: parentData, error: parentError } = await supabase
    .from("parents")
    .insert([parent])
    .select();

  if (parentError || !parentData?.length) {
    console.error("Error inserting parent:", parentError);
    return;
  }

  const parentId = parentData[0].id;

  // insert students
  const { data: studentData, error: studentError } = await supabase
    .from("students")
    .insert(studentsWithPasswords)
    .select();

  if (studentError || !studentData?.length) {
    console.error("Error inserting students:", studentError);
    return;
  }

  // insert parent-student relations
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
