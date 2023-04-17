import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Read //
router.get("/", verifyToken, getFeedPosts); //grab th user feed on the page
router.get("/:userId/posts", verifyToken, getUserPosts); //grab only the relevant user's post

// Update //
router.patch("/:id/like", verifyToken, likePost); //like and unlike

export default router;
