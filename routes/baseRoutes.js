const initializePassport = require('../passport.config');
const passport = require('passport');
const express = require('express');
const router = express.Router();
initializePassport(passport);

const {isAuthenticated, isNotAuthenticated} = require('../middlewares/authMiddlewares');
const { renderHomepage, 
    renderLoginPage, 
    renderRegisterPage, 
    handleRegister } = require('../controllers/baseController');

router
    .route('/')
    .get( renderHomepage );

router
    .route('/login')
    .get( isNotAuthenticated, renderLoginPage )
    .post( isNotAuthenticated, passport.authenticate('local', { 
        failureRedirect: '/login',
        failureFlash: true
    }), (req, res) => {
        req.flash('success', `Welcome ${req.user.name}`);
        res.redirect('/dashboard');
    });

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
