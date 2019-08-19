const express = require('express');
const router = express.Router();
const {AOPS} = require('.././models');

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You must be logged in to access dashbaord.');
    res.redirect('/login');
}

/* Import Notice handlers */
const { renderDashboardNotice, 
        renderDashboardNoticeNew, 
        renderUpdateNotice } = require('../handles/dashboard.notice');

/* Import Settings handlers */
const { renderDashboard,
        renderSettingsGeneral,
        updateAOPSInfo,
        renderAboutCommunity,
        renderAccountSettings,
        updateAccountInfo } = require('../handles/dashboard.settings');


/* Import Member handlers */
const { renderMemberInvite,
        inviteMember } = require('../handles/dashboard.member');


/* Dashboard main Route */
router
    .route('/')
    .get( isAuthenticated, renderDashboard );


/* Dashboard notice Routes */
router
    .route('/notice')
    .get( isAuthenticated, renderDashboardNotice );

router
    .route('/notice/new')
    .get( isAuthenticated, renderDashboardNoticeNew );

router
    .route('/notice/update/:id')
    .get( isAuthenticated, renderUpdateNotice );


/* Dashboard settings routes */
router
    .route('/settings')
    .get((req, res) => res.redirect('/dashboard/settings/general'))
    .put( isAuthenticated, updateAOPSInfo );

router
    .route('/settings/general')
    .get( isAuthenticated, renderSettingsGeneral );

router
    .route('/settings/about')
    .get( isAuthenticated, renderAboutCommunity );

router
    .route('/settings/account')
    .get( isAuthenticated, renderAccountSettings )
    .put( isAuthenticated, updateAccountInfo );


/* Dashboard member routes */
router
    .route('/members/invite')
    .get( isAuthenticated, renderMemberInvite )
    .post( isAuthenticated, inviteMember );

module.exports = router;
