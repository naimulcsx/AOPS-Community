const {Notice, Member} = require('../models');
const jwt = require('jsonwebtoken');

const renderHomepage = async(req, res) => {
    Notice
        .find({})
        .sort({created: -1})
        .limit( res.locals.AOPSInfo.numberOfNoticesOnHomepage )
        .then(notices => {
            res.render('index', {
                notices,
            });
        })
        .catch(err => {
            console.log(err);
        });
}

const renderLoginPage = async(req, res) => {
    res.render('login');
}


const renderRegisterPage = async(req, res) => {
    const AOPSInfo = res.locals.AOPSInfo;
    console.log(req.query);

    if ( !req.query.token ) {
        req.flash('error', `Contact ${AOPSInfo.name} ${AOPSInfo.type} for invitation.`)
        return res.redirect('/login');
    }

    try {
        var decoded = jwt.verify(req.query.token, 'super_secret');
        decoded.token = req.query.token;
        res.render('register', decoded);
    } catch(err) {
        req.flash('error', 'Token invalid or expired!');
        res.redirect('/login');
    }
    
}

const handleRegister = async (req, res) => {
    let validationErrors = [];

    // if the role comding from the form, doesn't match with role decoded from the token
    try {
        var decoded = jwt.verify(req.body.token, 'super_secret');
        if (decoded.role != req.body.role) {
            req.flash('error', 'Don\'t change your role.');
            return res.redirect('/login');
        }
    } catch( err ) {
        req.flash('error', 'Token expired!');
        res.redirect('/login');
    }

    // confirm passwords
    if (req.body.password != req.body.confPassword) 
        validationErrors.push('Passwords are not identical.');
    
    const newMember = new Member(req.body);
    
    newMember
        .validate()
        .then(user => {
            if (validationErrors.length > 0) {
                return res.render('register', {
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
                if (err.errors[field]) 
                    validationErrors.push(err.errors[field].message);
            });

            console.log(validationErrors);

            res.render('register', {
                validationErrors,
                prevData: req.body
            });
        });
}


module.exports = {
    renderHomepage,
    renderLoginPage,
    renderRegisterPage,
    handleRegister
}