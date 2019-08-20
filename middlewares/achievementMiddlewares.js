const {Achievement} = require('../models');

const userCanCreateNewAchievement = (req, res, next) => {
    if ( req.user.achievementPermissions.createUpdateDeleteSelf ) return next();
    req.flash('error', 'You are not allowed to update achievements.');
    res.redirect('/dashboard/achievement');
}

const userCanDeleteUpdateAchievement = async(req, res, next) => {
    let data = await Achievement.findById(req.params.id);
    if ( data.createdBy._id.equals( req.user._id ) || req.user.achievementPermissions.updateDeleteOthers ) 
        return next();
    req.flash('error', 'You are not allowed to update achievements.');
    res.redirect('/dashboard/achievement');
}

module.exports = {
    userCanCreateNewAchievement,
    userCanDeleteUpdateAchievement
}