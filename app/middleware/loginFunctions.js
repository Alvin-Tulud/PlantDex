import db from "../services/db.js";

/* ---------------- LOGIN ---------------- */
export const login = async (req, res, next) => {
  try {
    const { email } = req.body;

    // returns user if exists otherwise creates one
    const user = await db.getUserByEmail(email);

    // attach to session
    req.session.user = {
      user_id: user.user_id,
      username: user.username
    };

    console.log("Session created:", req.session.user);

    next();
  } catch (err) {
    console.error("verifyLogin error:", err);
    next(err);
  }
};


/* ---------------- LOGOUT ---------------- */
export const logout = (req, res, next) => {
  console.log("loginFunctions.logout called - destroying session");

  if (!req.session) return next();

  req.session.destroy(err => {
    if (err) {
      console.error("Error destroying session:", err);
      res.clearCookie("connect.sid");
      return next(err);
    }

    res.clearCookie("connect.sid");
    next();
  });
};
