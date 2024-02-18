import { routeMeta } from "../routes/meta.js";

// pages
export const getHomePage = (_req, res) => {
  const meta = routeMeta["home"];

  return res.render(meta.template, {
    ...meta.meta,
  });
};
