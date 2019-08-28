const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');


/* Import validators */
const {userCanCreateNewNotice, userCanDeleteUpdateNotice} = require('../middlewares/noticeMiddlewares');
const {userCanCreateNewAchievement, userCanDeleteUpdateAchievement} =require('../middlewares/achievementMiddlewares');
const {canInviteOthers} = require('../middlewares/baseMiddlewares');
const { userCanCreateNewGallery, userCanDeleteUpdateGallery } = require('../middlewares/galleryMiddlewares')
const {userCanCreateNewEvent, userCanDeleteUpdateEvent} = require('../middlewares/eventMiddlewares');



const storage = multer.diskStorage({
    destination: './uploads/avatar',
    filename: function(req, file, cb) {
        cb(null, 'avatar' + '-' + Date.now() + path.extname(file.originalname) )
    }
});

const upload = multer({
    storage: storage,
});


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
        inviteMember,
        handleAuthorize,
        renderAuthorize,
        handleUpdateAuthorizedMember } = require('../controllers/dashboard/memberController');


const { renderDashboardGallery, 
    renderDashboardGalleryNew,
    renderDashboardGalleryUpdate } = require('../controllers/dashboard/galleryController');



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
    .get( isAuthenticated, userCanCreateNewNotice, renderDashboardNoticeNew );

router
    .route('/notice/update/:id')
    .get( isAuthenticated, userCanDeleteUpdateNotice, renderUpdateNotice );


/* Dashboard achievements route */
router
    .route('/achievement')
    .get( isAuthenticated, renderDashboardAchievement );

router
    .route('/achievement/new')
    .get( isAuthenticated, userCanCreateNewAchievement ,renderDashboardAchievementNew );

router
    .route('/achievement/update/:id')
    .get( isAuthenticated, userCanDeleteUpdateAchievement, renderUpdateAchievement );


/* Dashboard settings routes */
const {isSuperadmin} = require('../middlewares/baseMiddlewares');
const uuidv1 = require('uuid/v1');

const storageLogo = multer.diskStorage({
    destination: './uploads/images',
    filename: function(req, file, cb) {
        cb(null, uuidv1() + path.extname(file.originalname) )
    }
});

const uploadLogo = multer({
    storage: storageLogo,
});

router
    .route('/settings')
    .get( (req, res) => res.redirect('/dashboard/settings/general'))
    .put( isAuthenticated, isSuperadmin, uploadLogo.single('logo'), updateAOPSInfo );

router
    .route('/settings/general')
    .get( isAuthenticated, isSuperadmin, renderSettingsGeneral );

router
    .route('/settings/about')
    .get( isAuthenticated, isSuperadmin, renderAboutCommunity );

router
    .route('/settings/account')
    .get( isAuthenticated, renderAccountSettings )
    .put( isAuthenticated, upload.single('photo'), updateAccountInfo );


/* Dashboard member routes */
router
    .route('/member/invite')
    .get( isAuthenticated, canInviteOthers, renderMemberInvite )
    .post( isAuthenticated, canInviteOthers, inviteMember );


router
    .route('/member/authorize')
    .get( isAuthenticated, isSuperadmin, renderAuthorize )
    .post( isAuthenticated, isSuperadmin, handleAuthorize );

router
    .route('/member/authorize/update')
    .post( isAuthenticated, isSuperadmin, handleUpdateAuthorizedMember );









/* Dashboard event routes */
const {renderDashboardEvent, renderDashboardEventNew, renderDashboardEventUpdate} = require('../controllers/dashboard/eventController');

router
    .route('/event')
    .get( isAuthenticated, renderDashboardEvent );

router
    .route('/event/new')
    .get( isAuthenticated, userCanCreateNewEvent, renderDashboardEventNew )

router
    .route('/event/update/:id')
    .get( isAuthenticated, userCanDeleteUpdateEvent, renderDashboardEventUpdate );


/* Dashboard gallery routes */

router
    .route('/gallery')
    .get( isAuthenticated, renderDashboardGallery );

router
    .route('/gallery/new')
    .get( isAuthenticated, userCanCreateNewGallery, renderDashboardGalleryNew );

router
    .route('/gallery/update/:id')
    .get( isAuthenticated, userCanDeleteUpdateGallery, renderDashboardGalleryUpdate );


module.exports = router;
