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

router
    .route('/')
    .get( renderDashboard );

router
    .route('/notice')
    .get( renderDashboardNotice );

router
    .route('/notice/new')
    .get( renderDashboardNoticeNew );

module.exports = router;

