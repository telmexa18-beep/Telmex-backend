import express from "express";
import { search } from "../controllers/search.mongo.controller.js";

const router = express.Router();

router.get("/", search);

export default router;
