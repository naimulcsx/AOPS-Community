const {Notice} = require('../models');
const mongoose = require('mongoose');

const userCanCreateNewNotice = (req, res, next) => {
    if (req.user.noticePermissions.createUpdateDeleteSelf) 
        return next();
    
    req.flash('error', 'You are not allowed to update notices.');
    res.redirect('/dashboard');
}

const userCanDeleteUpdateNotice = async(req, res, next) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        req.flash('error', 'Notice doesn\'t exist.');
        return res.redirect('/notice');
    }

    let notice = await Notice.findOne({_id: req.params.id}).populate('createdBy');
    if ( !notice ) {
        req.flash('error', 'Notice doesn\'t exist.');
        return res.redirect('/notice');
    }

    if ( notice.createdBy._id.equals( req.user._id) || req.user.noticePermissions.updateDeleteOthers ) 
        return next();
    req.flash('error', 'You are not allowed to update notices.');
    res.redirect('/dashboard');
}

const isPublicNotice = (req, res, next) => {
    Notice.findById(req.params.id)
        .then(notice => {
            if ( !notice ) {
                req.flash('error', 'Notice doesn\'t exist.');
                return res.redirect('/notice');
            }
            if ( notice.public || req.isAuthenticated() ) return next();
            req.flash('error', 'Notice is private.');
            return res.redirect('/notice');
        })
        .catch(err => {
            req.flash('error', 'Notice doesn\'t exist.');
            return res.redirect('/notice');
        });
}

module.exports = {
    userCanCreateNewNotice,
    userCanDeleteUpdateNotice,
    isPublicNotice
}