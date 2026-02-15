import { queryTable, updateTable } from "../services/db.js";
export const guardrail = async (req, res, next) => {  try {
  if (!req.session.user){
    res.redirect('/login')
  };
    next();
  } catch (err) {
    console.error("unable to guard", err);
    next(err);
  }
};
/* ---------------- LOGIN ---------------- */
export const login = async (req, res, next) => {
  try {
    const uname = req.body.username;

    // check if user exists
    const users = await queryTable(
      "SELECT * FROM user WHERE username = ?",
      [uname]
    );

    // create user if not found
    if (users.length < 1) {

      const result = await updateTable(
        "INSERT INTO user (username) VALUES (?)",
        [uname]
      );

      // ⭐ use insertId
      req.session.user = {
        user_id: result.insertId,
        username: uname
      };

    } else {

      req.session.user = {
        user_id: users[0].user_id,
        username: users[0].username
      };
    }

    console.log("Session created:", req.session.user);

    // VERY IMPORTANT — wait for session write
    req.session.save(() => next());

  } catch (err) {
    console.error("verifyLogin error:", err);
    next(err);
  }
};




/* ---------------- LOGOUT ---------------- */
export const logout = (req, res, next) => {
  console.log("logout called");

  if (!req.session) return res.sendStatus(204);

  req.session.destroy(err => {
    if (err) {
      console.error("Error destroying session:", err);
      return next(err);
    }

    // remove cookie from browser
    res.clearCookie("connect.sid");

    res.redirect("/login")
  });
};
