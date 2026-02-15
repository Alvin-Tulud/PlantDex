exports.guardrail = async (req, res, next) => {
    const loginStatus = req.session.loggedIn;
    if(!loginStatus){
        return res.redirect('/login');
    }
    next();
};
