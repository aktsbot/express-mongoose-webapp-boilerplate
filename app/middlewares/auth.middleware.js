import logger from "../logger.js";
import User from "../models/user.model.js";

export const loadUserSession = async (req, res, next) => {
  logger.debug(res.locals);

  // look in app/index.js - session is loaded first and the first middleware
  // sets res.locals.user from session.
  if (!res.locals.user) {
    return next();
  }

  try {
    const userInfo = await User.findById(res.locals.user, {
      _id: 1,
      email: 1,
      fullName: 1,
    });

    if (!userInfo) {
      // something weird happened with the session.
      // a session exists for a user who does not exist??
      res.locals.user = null;
      req.session.user = null;
      return next();
    }

    // this is the actual mongoose doc instance,
    // so we could change it and persist it to the database
    res.locals.user = userInfo;

    return next();
  } catch (error) {
    next(error);
  }
};

export const requireUser = async (req, res, next) => {
  // look in app/index.js - session is loaded first and the first middleware
  // sets res.locals.user from session.
  if (!res.locals.user) {
    req.flash("error", [`Sorry! You need to login.`]);
    return res.status(403).redirect("/");
  }

  return next();
};

// if user is logged in, they should not see the login or signup pages
export const goHomeIfLoggedIn = (_req, res) => {
  if (res.locals.user) {
    return res.redirect("/");
  }

  return next();
};
