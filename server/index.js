import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path"; //come with node.js
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

// Configurations //
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
dotenv.config(); //load file env to process
const app = express();
app.use(express.json());
app.use(helmet()); //helmet - secure Node.js application.
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));  //מידלוור לתיעוד בקשות ושגיאות HTTP
app.use(bodyParser.json({ limit: "30mb", extended: true })); 
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors()); 
app.use("/assets", express.static(path.join(_dirname, "public/assets"))); //set the directory of where we keep our images.

// File Storage //
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets"); //save files that upload in assets.
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }); //help to save it (anytime we need to upload a file we use it).

// Routes With Files
app.post("/auth/register", upload.single("picture"), register); //if want to register, we going to call this API from the frontend.
app.post("/posts", verifyToken, upload.single("picture"), createPost); //verifyToken - middleware that verify the details 

// Routes //
app.use("/auth", authRoutes); //prefix to login
app.use("/users", userRoutes); //set up a separate routes
app.use("/posts", postRoutes);

// Mongoose Setup //
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO, {
    //connect to database from the node server
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    //after connect
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    // Add Data One Time //
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} didn't connect`));
