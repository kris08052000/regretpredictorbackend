import { Router } from "express";
import { login, signup } from "../controllers/auth.controller.js";
import Validate from "../middleware/validate.js";
import { loginSchema, signupSchema } from "../validators/auth.validator.js";


const router = Router();

router.post("/signup", Validate(signupSchema) , signup);
router.post("/login", Validate(loginSchema) , login);

export default router;