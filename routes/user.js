import { Router } from "express";
import { createUser, authUser } from "../controllers/userController.js";

const router = Router();

router.post("/create-user", createUser);
router.post("/auth-user", authUser);

export default router;
