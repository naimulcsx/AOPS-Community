const express = require('express');
const router = express.Router();
const {Notice, AOPS} = require('../models');


const renderHomepage = async(req, res) => {
    const AOPSInfo = await AOPS.find({});
    const AOPSInfoObject = AOPSInfo[0];

    Notice
        .find({})
        .sort({created: -1})
        .limit( AOPSInfoObject.numberOfNoticesOnHomepage )
        .then(notices => {
            res.render('index', {
                notices,
                AOPSInfo: AOPSInfoObject,
            });
        })
        .catch(err => {
            console.log(err);
        });
}

const renderLoginPage = async(req, res) => {
    const AOPSInfo = await AOPS.find({});
    const AOPSInfoObject = AOPSInfo[0];

    res.render('login', {
        AOPSInfo: AOPSInfoObject
    });
}

const handleLogin = async(req, res) => {
    console.log(req.body);
    res.send('hello world');
}

router
    .route('/')
    .get( renderHomepage );

router
    .route('/login')
    .get( renderLoginPage )
    .post( handleLogin );

router
    .route('/register')
    .get((req, res) => {
    });

module.exports = router;