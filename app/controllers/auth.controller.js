import logger from "../logger.js";

import { routeMeta } from "../routes/meta.js";

import { sendForgotPasswordEmail } from "../email.js";

import User from "../models/user.model.js";

// pages
export const getLoginPage = (_req, res) => {
  const meta = routeMeta["login"];

  return res.render(meta.template, {
    ...meta.meta,
  });
};

export const getSignupPage = (_req, res) => {
  const meta = routeMeta["signup"];
  return res.render(meta.template, {
    ...meta.meta,
  });
};

export const getForgotPasswordPage = (_req, res) => {
  const meta = routeMeta["forgotPassword"];
  return res.render(meta.template, {
    ...meta.meta,
  });
};

export const getResetPasswordPage = (req, res) => {
  if (!req.query.userId || !req.query.resetCode) {
    return res.redirect("/");
  }
  const meta = routeMeta["resetPassword"];
  return res.render(meta.template, {
    ...meta.meta,
    userId: req.query.userId,
    resetCode: req.query.resetCode,
  });
};

export const getMyProfilePage = (_req, res) => {
  const meta = routeMeta["profile"];
  return res.render(meta.template, {
    ...meta.meta,
    userInfo: res.locals.user,
  });
};

export const getLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
      return;
    }
    return res.redirect("/");
  });
};

// page submissions
// or normal webapi endpoints

export const signupUser = async (req, res, next) => {
  const meta = routeMeta["signup"];

  try {
    const { body } = req.xop;
    const userPresent = await User.findOne({ email: body.email }, { _id: 1 });

    if (userPresent) {
      req.flash("error", [`User with email ${body.email} already exists`]);
      return res.status(409).render(meta.template, {
        ...meta.meta,
        flashes: req.flash(),
        body,
      });
    }

    await new User({ ...body }).save();

    req.flash("success", [`Your account has been created. Please login.`]);
    return res.redirect(301, "/auth/login");
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const meta = routeMeta["login"];

  try {
    const errorMessage = "Invalid email or password";

    const { body } = req.xop;
    const userPresent = await User.findOne(
      { email: body.email },
      { _id: 1, password: 1, email: 1, fullName: 1 },
    );

    if (!userPresent) {
      req.flash("error", [errorMessage]);
      return res.status(401).render(meta.template, {
        ...meta.meta,
        flashes: req.flash(),
        body,
      });
    }

    const isPasswordValid = await userPresent.isValidPassword(body.password);

    logger.debug(`password valid ${isPasswordValid}`);

    if (!isPasswordValid) {
      req.flash("error", [errorMessage]);
      return res.status(401).render(meta.template, {
        ...meta.meta,
        flashes: req.flash(),
        body,
      });
    }

    req.session.user = {
      _id: userPresent._id,
    };

    req.flash("success", [`Welcome back, ${userPresent.fullName}`]);
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const user = { ...res.locals.user };
    const { body } = req.xop;

    const userInfo = await User.findById(user._id);

    if (!(await userInfo.isValidPassword(body.oldPassword))) {
      return next({
        status: 400,
        message: "Current password is invalid",
      });
    }

    userInfo.password = body.newPassword;
    await userInfo.save();

    await Session.deleteMany({ user: userInfo._id });

    return res.send({
      message: "New password has been set. Please login again",
      messageCode: "RE_LOGIN",
      user: {
        uuid: user.uuid,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const message =
      "If the email address exists in our system, it should be getting an email shortly.";
    const { body } = req.xop;
    const userPresent = await User.findOne({ email: body.email });

    if (!userPresent) {
      req.flash("success", [message]);
      return res.redirect(req.get("referer"));
    }

    userPresent.generateReset();

    await userPresent.save();

    logger.debug(userPresent.uuid);
    logger.debug(userPresent.passwordReset.code);

    await sendForgotPasswordEmail({
      to: body.email,
      resetCode: userPresent.passwordReset.code,
      userId: userPresent.uuid,
    });

    req.flash("success", [message]);
    return res.redirect(req.get("referer")); // back to the page where the request came from
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { body } = req.xop;

    const userFound = await User.findOne({
      uuid: body.userId,
    });

    if (!userFound) {
      req.flash("error", [`User not found`]);
      return res.redirect(req.get("referer"));
    }

    // check if code has expired?
    if (!userFound.isResetCodeValid(body.resetCode)) {
      req.flash("error", [
        `Password reset token is invalid or has been expired. Please try a new reset.`,
      ]);
      return res.status(400).redirect("/auth/forgot-password");
    }

    userFound.password = body.password;
    userFound.clearReset();
    await userFound.save();

    req.flash("success", [
      `Password has been updated successfully. Please login.`,
    ]);
    return res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
};
