const isSuperadmin = (req, res, next) => {
    if ( req.user.role === 'Superadmin' ) return next();
    req.flash('error', 'You are not authorized for this action.');
    res.redirect('/dashboard');
}

const canInviteOthers = (req, res, next) => {
    if ( req.user.invitePermissions ) return next();
    req.flash('error', 'You are not authorized for this action.');
    res.redirect('/dashboard');
}

module.exports = {
    isSuperadmin,
    canInviteOthers
}