exports.guardrail = async (req, res, next) => {
    if (!req.session.loggedIn || !req.session.user?.user_id) {
        return res.redirect('/login');
    }
    next();
};
