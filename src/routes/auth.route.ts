// src/routes/auth.route.ts
import { Router } from "express";
import {
  register,
  login,
  logout,
  deleteUser,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.delete("/deleteUser/:userId", deleteUser);

export default router;
