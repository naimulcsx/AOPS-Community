const canCreateNotice = (req, res, next) => {
    if (req.user.canPostNotices) {
        return next();
    }
    req.flash('error', 'You are not allowed to update notices.');
    res.redirect('/dashboard');
}

module.exports = {
    canCreateNotice
}