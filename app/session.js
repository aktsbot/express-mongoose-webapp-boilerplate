import session from "express-session";
import mongoSession from "connect-mongodb-session";

import config from "./config.js";
import logger from "./logger.js";

const mongoDBStore = mongoSession(session);

export const sessionStore = new mongoDBStore({
  uri: config.session_mongodb_uri,
  collection: config.session_mongodb_collection,
});

sessionStore.on("error", function (error) {
  logger.error("session store errored");
  logger.error(error);
});

sessionStore.on("connected", function () {
  logger.info("session store connected");
});

// https://expressjs.com/en/resources/middleware/session.html
export const appSession = () =>
  session({
    secret: config.session_secret,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    name: config.session_cookie_name,
  });
