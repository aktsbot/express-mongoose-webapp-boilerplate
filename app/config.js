let appName = process.env.APP_NAME || "The App";

const config = {
  app_name: appName,

  port: process.env.PORT || 3303,
  env: process.env.NODE_ENV || "development",
  mongodb_uri: process.env.MONGODB_URI,
  session_mongodb_uri: process.env.SESSION_MONGODB_URI,
  session_mongodb_collection: process.env.SESSION_MONGODB_COLLECTION,
  session_secret: process.env.SESSION_SECRET,
  session_cookie_name: `${appName.replace(/\s+/g, "_").toLowerCase()}.sid`, /// The App ==> the_app

  // email
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpUsername: process.env.SMTP_USERNAME,
  smtpPassword: process.env.SMTP_PASSWORD,
  emailFromAddress: process.env.EMAIL_FROM_ADDRESS,

  frontendUrl: process.env.FRONTEND_URL,
};

export default config;
