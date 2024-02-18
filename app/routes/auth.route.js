import { Router } from "express";

import { validatePageSubmission } from "../middlewares/validate.middleware.js";
import { goHomeIfLoggedIn } from "../middlewares/auth.middleware.js";

import { routeMeta } from "./meta.js";

import {
  loginUser,
  signupUser,

  // pages --
  getLoginPage,
  getSignupPage,
  getForgotPasswordPage,
} from "../controllers/auth.controller.js";

import {
  loginUserSchema,
  signupUserSchema,
} from "../validations/schemas/auth.schema.js";

const router = Router();

// pages routes
router.get("/login", goHomeIfLoggedIn, getLoginPage);
router.get("/signup", goHomeIfLoggedIn, getSignupPage);
router.get("/forgot-password", goHomeIfLoggedIn, getForgotPasswordPage);

// api or page submission routes
router.post(
  "/signup",
  validatePageSubmission({
    schema: signupUserSchema,
    routeMeta: routeMeta["signup"],
  }),
  signupUser,
);
router.post(
  "/login",
  validatePageSubmission({
    schema: loginUserSchema,
    routeMeta: routeMeta["login"],
  }),
  loginUser,
);

export default router;
