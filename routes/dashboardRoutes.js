const express = require('express');
const router = express.Router();
const {AOPS} = require('../models');
const {canCreateNotice} = require('../validators/noticeValidators');

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
        renderUpdateNotice } = require('../controllers/dashboard/noticeController');

/* Import achievement handles */
const {
    renderDashboardAchievement,
    renderDashboardAchievementNew,
    renderUpdateAchievement } = require('../controllers/dashboard/achievementController');

/* Import Settings handlers */
const { renderDashboard,
        renderSettingsGeneral,
        updateAOPSInfo,
        renderAboutCommunity,
        renderAccountSettings,
        updateAccountInfo } = require('../controllers/dashboard/settingsController');


/* Import Member handlers */
const { renderMemberInvite,
        inviteMember } = require('../controllers/dashboard/memberController');


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
    .get( isAuthenticated, canCreateNotice, renderDashboardNoticeNew );

router
    .route('/notice/update/:id')
    .get( isAuthenticated, renderUpdateNotice );


// Achivements are just notices with cover images



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

/* Dashboard achievements route */
router
    .route('/achievement')
    .get( isAuthenticated, renderDashboardAchievement );

router
    .route('/achievement/new')
    .get( isAuthenticated, renderDashboardAchievementNew );

router
    .route('/achievement/update/:id')
    .get( isAuthenticated, renderUpdateAchievement );



module.exports = router;