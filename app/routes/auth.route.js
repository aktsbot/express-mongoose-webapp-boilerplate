import { Router } from "express";

import {
  validate,
  validatePageSubmission,
} from "../middlewares/validate.middleware.js";
import { requireUser } from "../middlewares/auth.middleware.js";

import { routeMeta } from "./meta.js";

import {
  loginUser,
  signupUser,
  getUserInfo,
  makeNewTokens,
  updatePassword,
  forgotPassword,
  resetPassword,
  getLoginPage,
  getSignupPage,
} from "../controllers/auth.controller.js";

import {
  loginUserSchema,
  signupUserSchema,
  makeNewTokensSchema,
  updatePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/schemas/auth.schema.js";

const router = Router();

// pages routes
router.get("/login", getLoginPage);
router.get("/signup", getSignupPage);

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
    schema: signupUserSchema,
    routeMeta: routeMeta["login"],
  }),
  loginUser,
);

router.get("/user-info", requireUser, getUserInfo);
router.post("/token", validate(makeNewTokensSchema), makeNewTokens);
router.put(
  "/password",
  requireUser,
  validate(updatePasswordSchema),
  updatePassword,
);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;
