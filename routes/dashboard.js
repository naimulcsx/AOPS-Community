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
        AOPSInfo: AOPSInfoObj
    });
}

/* DASHBOARD MAIN PAGE */

router
    .route('/')
    .get( renderDashboard );


/* DASHBOARD NOTICE ROUTES */

router
    .route('/notice')
    .get( renderDashboardNotice );

router
    .route('/notice/new')
    .get( renderDashboardNoticeNew );

router
    .route('/notice/update/:id')
    .get( renderUpdateNotice );


/* DASHBOARD SETTINGS ROUTES */
const renderSettingsGeneral = async (req, res) => {
    const AOPSInfo = await AOPS.find({});
    const AOPSInfoObj = AOPSInfo[0];
    res.render('dashboard/settings/general',{
        AOPSInfo: AOPSInfoObj
    });
}

const updateAOPSInfo = async(req, res) => {
    const AOPSInfo = await AOPS.find({});
    const AOPSInfoObj = AOPSInfo[0];
    const id = AOPSInfoObj._id;


    for (let prop in req.body) {
        let addressFields = ['city', 'country', 'zip'];
        if (prop === '_id') continue;
        if ( addressFields.includes(prop) ) AOPSInfoObj.address[prop] = req.body[prop];
        else AOPSInfoObj[prop] = req.body[prop];
    }

    AOPS
        .findByIdAndUpdate(id, AOPSInfoObj)
        .then(data => {
            if (req.body.aboutDesc) {
                req.flash('success', 'Updated community description!');
                res.redirect('/dashboard/settings/about');
                return;
            }
            req.flash('success', 'Updated community settings!');
            res.redirect('/dashboard/settings/general');
        })
        .catch(err => {
            if (req.body.aboutDesc) {
                req.flash('success', 'Some error occured!');
                res.redirect('/dashboard/settings/about');
                return;
            }
            req.flash('error', 'Some error occured!');
            res.redirect('/dashboard/settings/general');
        });
}

const renderAboutCommunity = async (req, res) => {
    const AOPSInfo = await AOPS.find({});
    const AOPSInfoObj = AOPSInfo[0];
    const id = AOPSInfoObj._id;

    res.render('dashboard/settings/about', {
        AOPSInfo: AOPSInfoObj,
    });
}


router
    .route('/settings')
    .get((req, res) => res.redirect('/dashboard/settings/general'))
    .put( updateAOPSInfo );

router
    .route('/settings/general')
    .get( renderSettingsGeneral );

router
    .route('/settings/about')
    .get( renderAboutCommunity );


module.exports = router;

