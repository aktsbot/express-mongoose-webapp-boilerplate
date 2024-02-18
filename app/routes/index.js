import { Router } from "express";

import authRouter from "./auth.route.js";
import userRouter from "./user.route.js";
import generalRouter from "./general.route.js";

const appRouter = Router();

appRouter.use("/auth", authRouter);
appRouter.use("/users", userRouter);

// should be the last route
appRouter.use("/", generalRouter);

export default appRouter;
