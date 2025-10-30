import { Request, Response } from "express";
import { Student } from "../services/Student.service";

export async function StudentGetIDController(req: Request, res: Response) {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Missing student ID",
      });
    }

    const data = await Student.GET_ID(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error("StudentGetIDController error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
}
