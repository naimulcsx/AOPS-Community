const {Notice, AOPS, Member} = require('.././models');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const createHash = (password) => {
    return bcrypt.hashSync(password, 10);
}

const isAuthenticated = function (req, res, next) {
    if ( req.isAuthenticated() ) return next();
    res.redirect('/login');
}