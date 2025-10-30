import { Request, Response } from "express";
import { RegisterParentAndStudent } from "../services/RegisterParentAndStudent.service";
export async function RegisterParentAndStudentController(
  req: Request,
  res: Response
) {
  try {
    const { parent, students } = req.body;
    if (!parent || !students || !Array.isArray(students)) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }
    const result = await RegisterParentAndStudent(parent, students);
    if (!result) {
      return res.status(500).json({ success: false, message: "Insert failed" });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
