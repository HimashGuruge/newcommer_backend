import express from "express";
// createCategory එක import කරන්න අමතක කරන්න එපා
import { getCategories, createCategory } from "../controller/categoryController.js";

const router = express.Router();

// දැනට තියෙන categories ලබා ගැනීමට (Frontend useEffect එකෙන් මේක call කරයි)
router.get("/", getCategories);

// අලුත් category එකක් save කිරීමට (Frontend handleUpload එකෙන් මේක call කරයි)
router.post("/", createCategory);

export default router;