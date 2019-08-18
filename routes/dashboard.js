const express = require('express');
const router = express.Router();
const {Notice, AOPS} = require('.././models');

const {
    renderDashboardNotice,
    renderDashboardNoticeNew,
    renderUpdateNotice
} = require('../handles/dashboard-notice');

const renderDashboard = async (req, res) => {
    const AOPSInfo = await AOPS.find({});
    const AOPSInfoObj = AOPSInfo[0];

    res.render('dashboard/index', {
        AOPSInfo: AOPSInfoObj, 
        url: req.url
    });
}

// render dashboard main
router
    .route('/')
    .get( renderDashboard );

// Notice Index
router
    .route('/notice')
    .get( renderDashboardNotice );

// Create new notice route
router
    .route('/notice/new')
    .get( renderDashboardNoticeNew );

// Update notice route
router
    .route('/notice/update/:id')
    .get( renderUpdateNotice );

module.exports = router;

