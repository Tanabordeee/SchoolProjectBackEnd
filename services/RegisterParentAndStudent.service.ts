import { supabase } from "../config/supabase";
import type { Parent, Student } from "../config/config";
import bcrypt from "bcrypt";

export async function RegisterParentAndStudent(
  parent: Parent,
  students: Student[]
) {
  const { nanoid } = await import("nanoid");

  // สร้าง password ให้ parent
  const parentPlainPassword = nanoid(10);
  const parentHashedPassword = await bcrypt.hash(parentPlainPassword, 10);
  parent.password = parentHashedPassword;

  // สร้าง password ให้ students
  const studentsWithPasswords = await Promise.all(
    students.map(async (s) => {
      const plainPassword = nanoid(10);
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      return {
        ...s,
        password: hashedPassword,
        _plainPassword: plainPassword, // เก็บชั่วคราว
      };
    })
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
    .insert(
      studentsWithPasswords.map(({ _plainPassword, ...rest }) => rest)
    )
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

  // return ให้ตรงกับ frontend ใช้ password เป็น plainPassword
  return {
    parent: { ...parentData[0], password: parentPlainPassword },
    students: studentsWithPasswords.map((s, i) => ({
      ...studentData[i],
      password: s._plainPassword,
    })),
  };
}
