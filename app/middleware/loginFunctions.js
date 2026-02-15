import { queryTable, updateTable } from "../services/db.js";

/* ---------------- LOGIN ---------------- */
export const login = async (req, res, next) => {
  try {
    const uname = req.body.username;

    // returns user if exists otherwise creates one
    const user = await queryTable("SELECT * FROM user WHERE username = ?", [uname]);
    
    // create user if couldn't find one
    if (user.length < 1) {
      const res = await updateTable("INSERT INTO user (username) VALUES (?)", [uname]);
      user.user_id = res.resultId;
      user.username = uname;
    }

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
