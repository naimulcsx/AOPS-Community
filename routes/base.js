const express = require('express');
const router = express.Router();
const {Notice, AOPS, Member} = require('../models');


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


const renderRegisterPage = async(req, res) => {
    const AOPSInfo = await AOPS.find({});
    const AOPSInfoObj = AOPSInfo[0];

    res.render('register', {
        AOPSInfo: AOPSInfoObj
    });
}

const handleLogin = async(req, res) => {
    console.log(req.body);
    res.send('hello world');
}

const handleRegister = async (req, res) => {
    const AOPSInfo = await AOPS.find({});
    const AOPSInfoObj = AOPSInfo[0];
    let validationErrors = []

    if (req.body.password != req.body.confPassword) 
        validationErrors.push('Passwords are not identical.');
    
    const newMember = new Member(req.body);
    
    newMember
        .validate()
        .then(user => {
            if (validationErrors.length > 0) {
                return res.render('register', {
                    AOPSInfo: AOPSInfoObj,
                    validationErrors
                });
            }
            return newMember.save();
        })
        .then(user => {
            req.flash('success', 'Account created successfully. You may login now.')
            res.redirect('/login');
        })
        .catch(err => {
            let fields = ['name', 'password', 'email', 'phone'];
            
            fields.forEach(field => {
                if (err.errors[field]) validationErrors.push(err.errors[field].message);
            });

            console.log(validationErrors);

            res.render('register', {
                AOPSInfo: AOPSInfoObj,
                validationErrors,
                prevData: req.body
            });
        });
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
    .get( renderRegisterPage ) 
    .post( handleRegister );

module.exports = router;