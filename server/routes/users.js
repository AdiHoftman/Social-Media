import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Read //
router.get("/:id", verifyToken, getUser); //if the user/front send a particular user ID,
//  can grab this ID and call our database with that. will get the user.
router.get("/:id/friends", verifyToken, getUserFriends); // grab the user friends

// Update //
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
