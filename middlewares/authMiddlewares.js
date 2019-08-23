const isNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated())
        return res.redirect('/dashboard');
    next();
}
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    req.flash('error', 'You must be logged in to perfom the action.');
    res.redirect('/login');
}

module.exports = {
    isAuthenticated,
    isNotAuthenticated
}