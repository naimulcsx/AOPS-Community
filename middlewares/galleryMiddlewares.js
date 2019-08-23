const {Gallery} = require('../models');

const userCanCreateNewGallery = (req, res, next) => {
    if (req.user.galleryPermissions.createUpdateDeleteSelf) 
        return next();
    
    req.flash('error', 'You are not allowed to update galleries.');
    res.redirect('/dashboard');
}

const userCanDeleteUpdateGallery = async(req, res, next) => {
    let gallery = await Gallery.findOne({_id: req.params.id});
    if ( gallery.createdBy._id.equals( req.user._id) || req.user.noticePermissions.updateDeleteOthers ) 
        return next();
    req.flash('error', 'You are not allowed to update galleries.');
    res.redirect('/dashboard');
}

module.exports = {
    userCanCreateNewGallery,
    userCanDeleteUpdateGallery
}