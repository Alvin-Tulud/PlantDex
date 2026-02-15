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

    // returns user if exists otherwise creates one
    const user = await queryTable("SELECT * FROM user WHERE username = ?", [uname]);
    
    // create user if couldn't find one
    if (user.length < 1) {
      const res = await updateTable("INSERT INTO user (username) VALUES (?)", [uname]);
            req.session.user = {
            user_id : res.resultId,
            username : uname
            }
    }
    else{
      req.session.user = {
      user_id: user[0].user_id,
      username: user[0].username
    };
    }

    // attach to session
  

    console.log("Session created:", req.session.user);

    next();
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
