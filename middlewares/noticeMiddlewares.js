const {Notice} = require('../models');

const userCanCreateNewNotice = (req, res, next) => {
    if (req.user.noticePermissions.createUpdateDeleteSelf) 
        return next();
    
    req.flash('error', 'You are not allowed to update notices.');
    res.redirect('/dashboard');
}

const userCanDeleteUpdateNotice = async(req, res, next) => {
    let notice = await Notice.findById(req.params.id);
    if ( notice.createdBy._id.equals( req.user._id) || req.user.noticePermissions.updateDeleteOthers ) 
        return next();
    req.flash('error', 'You are not allowed to update notices.');
    res.redirect('/dashboard');
}

module.exports = {
    userCanCreateNewNotice,
    userCanDeleteUpdateNotice
}