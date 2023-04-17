import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router(); // allow Express to identify the routes

router.post("/login", login);

export default router;
