import express, { Express } from "express";
import { LoginController } from "../controller/Login.controller";
import { RegisterParentAndStudentController } from "../controller/RegisterParentAndStudent.controller";
import { authMiddleware } from "../services/authMiddleware";
import { requireRole } from "../services/RequireRole";
import { GetMeController } from "../controller/GetMe.controller";
import { ParentController } from "../controller/Parent.controller";
import { StudentController } from "../controller/Student.controller";
import { StudentGetIDController } from "../controller/StudentGetID.controller";
import { ChangePassword } from "../controller/StudentAndParentPassword.controller";
import { TeacherController } from "../controller/Teacher.controller";
const router = express.Router();

router.post("/login" , LoginController);
router.post("/parent/student/register" , authMiddleware , requireRole("teacher") , RegisterParentAndStudentController);
router.get("/me" , GetMeController);
router.get("/parent" , authMiddleware , requireRole("parent")  , ParentController)
router.get("/student" , authMiddleware , requireRole("student") ,  StudentController)
router.post("/studentid", StudentGetIDController )
router.patch("/changepassword" , ChangePassword)
router.get("/teacher" , TeacherController)
export default router