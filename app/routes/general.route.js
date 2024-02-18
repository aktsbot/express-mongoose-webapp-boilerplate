import { Router } from "express";

import {
  loadUserSession,
  requireUser,
} from "../middlewares/auth.middleware.js";

import { getHomePage } from "../controllers/general.controller.js";

const router = Router();

// pages routes
router.get("/", loadUserSession, getHomePage);

export default router;
