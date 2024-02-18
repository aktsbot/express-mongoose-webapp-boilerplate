import { Router } from "express";

import authRouter from "./auth.route.js";
import generalRouter from "./general.route.js";

const appRouter = Router();

appRouter.use("/auth", authRouter);

// should be the last route
appRouter.use("/", generalRouter);

export default appRouter;
