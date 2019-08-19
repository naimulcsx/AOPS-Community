const express = require('express');
const router = express.Router();
const {Notice, AOPS, Member} = require('../models');
const passport = require('passport');

const initializePassport = require('../passport.config');
initializePassport(passport);

const {isAuthenticated, isNotAuthenticated} = require('../handles/authUtility');
const {renderHomepage, renderLoginPage, renderRegisterPage, handleRegister } = require('../handles/base');

router
    .route('/')
    .get( renderHomepage );

router
    .route('/login')
    .get( isNotAuthenticated, renderLoginPage )
    .post( isNotAuthenticated, passport.authenticate('local', { 
        failureRedirect: '/login', 
        successRedirect: '/dashboard',
        failureFlash: true
    }));

router
    .route('/register')
    .get( isNotAuthenticated, renderRegisterPage ) 
    .post( isNotAuthenticated, handleRegister );

router
    .route('/logout')
    .get(isAuthenticated, (req, res) => {
        req.logout();
        req.flash('success', 'Logged out successfully.');
        res.redirect('/login');
    });

module.exports = router;
