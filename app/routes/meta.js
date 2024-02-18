// all this file holds is the path to the templates and their default values for each routes

export const routeMeta = {
  login: {
    template: "pages/login.html",
    meta: {
      title: "Login",
    },
  },
  signup: {
    template: "pages/signup.html",
    meta: {
      title: "Signup",
    },
  },
  forgotPassword: {
    template: "pages/forgot-password.html",
    meta: {
      title: "Forgot password?",
    },
  },
  home: {
    template: "pages/home.html",
    meta: {
      title: "Home",
    },
  },
  resetPassword: {
    template: "pages/reset-password.html",
    meta: {
      title: "Reset password",
    },
  },
};
