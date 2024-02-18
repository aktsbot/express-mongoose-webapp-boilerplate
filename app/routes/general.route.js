import { Router } from "express";

import {
  loadUserSession,
  requireUser,
} from "../middlewares/auth.middleware.js";

import { getHomePage } from "../controllers/general.controller.js";
import { getLogout } from "../controllers/auth.controller.js";

const router = Router();

// pages routes
// its a common pattern to have the logout route like app.com/logout. Lets
// give our users what they are used to.
router.get("/logout", getLogout);
router.get("/", loadUserSession, getHomePage);

export default router;
