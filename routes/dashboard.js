const express = require('express');
const router = express.Router();
const {Notice, AOPS} = require('.././models');

const renderDashboard = async (req, res) => {
    const AOPSInfo = await AOPS.find({});
    const AOPSInfoObj = AOPSInfo[0];


    res.render('dashboard/index', {
        AOPSInfo: AOPSInfoObj, 
        url: req.url
    });
}

const renderDashboardNotice = async (req, res) => {
    const AOPSInfo = await AOPS.find({});
    const AOPSInfoObj = AOPSInfo[0];

    const notices = 
        await Notice
        .find({})
        .sort({created: -1});

    res.render('dashboard/notice/index', {
        notices,
        AOPSInfo: AOPSInfoObj,
        url: req.url
    });
}

const renderDashboardNoticeNew = async (req, res) => {
    const AOPSInfo = await AOPS.find({});
    const AOPSInfoObj = AOPSInfo[0];

    res.render('dashboard/notice/new', {
        AOPSInfo: AOPSInfoObj,
        url: req.url
    });
}

const renderUpdateNotice = async(req, res) => {
    const AOPSInfo = await AOPS.find({});
    const AOPSInfoObj = AOPSInfo[0];
    const notice = await Notice.findById(req.params.id);

    console.log(notice);
    res.render('dashboard/notice/update', {
        AOPSInfo: AOPSInfoObj,
        url: req.url,
        notice 
    });
}

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

