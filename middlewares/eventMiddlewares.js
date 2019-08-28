const {Event} = require('../models');

const userCanCreateNewEvent = (req, res, next) => {
    if (req.user.eventPermissions.createUpdateDeleteSelf) return next();
    req.flash('error', 'You are not allowed to update events.');
    res.redirect('/dashboard');
}

const userCanDeleteUpdateEvent = async(req, res, next) => {
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        req.flash('error', 'Notice doesn\'t exist.');
        return res.redirect('/notice');
    }

    let event = await Event.findOne({_id: req.params.id}).populate('createdBy');
    if ( event.createdBy._id.equals( req.user._id ) || req.user.noticePermissions.updateDeleteOthers ) 
        return next();
    req.flash('error', 'You are not allowed to update events.');
    res.redirect('/dashboard');
}

module.exports = {
    userCanCreateNewEvent, 
    userCanDeleteUpdateEvent
}
