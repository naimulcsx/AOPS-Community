const {Notice, Member, Achievement} = require('../models');
const jwt = require('jsonwebtoken');

const renderHomepage = async(req, res) => {
    Notice
        .find({})
        .sort({created: -1})
        .limit( res.locals.AOPSInfo.numberOfNoticesOnHomepage )
        .then(async(notices) => {
            try {
                let achievements = 
                    await Achievement
                        .find({})
                        .sort({created: -1})
                        .limit(res.locals.AOPSInfo.numberOfAchievementsOnHomepage);

                res.render('index', {
                    notices,
                    achievements
                });
            } catch(err) { console.log(err) }
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

        // check if the token is already used for registration
        Member
            .findOne({token: req.query.token})
            .then(user => {
                if (!user) {
                    return res.render('register', decoded);
                }
                req.flash('error', 'Token already used!');
                return res.redirect('/login');
            })
            .catch(err => {});

    } catch(err) {
        req.flash('error', 'Token invalid or expired!');
        res.redirect('/login');
    }
}

const handleRegister = async (req, res) => {
    let validationErrors = [];
    const accountTypes = ['Member', 'Faculty Member', 'Lab Assistant', 'Executive', 'Staff'];

    if ( !accountTypes.includes(req.body.role) ) {
        req.flash('error', 'Invalid role.');
        return res.redirect('/register');
    }

    let decoded;
    // if the role coming from the form, doesn't match with role decoded from the token
    try {
        decoded = jwt.verify(req.body.token, 'super_secret');
        if (decoded.role != req.body.role) {
            req.flash('error', 'Don\'t change your role.');
            return res.redirect(`${req.originalUrl}?token=${req.body.token}`);
        }
    } catch( err ) {
        req.flash('error', 'Token expired!');
        res.redirect('/login');
    }

    // check if the token is already used for registration
    Member
        .findOne({token: req.body.token})
        .then(user => {
            if (!user) return;
            req.flash('error', 'Token already used!');
            return res.redirect('/login');
        })
        .catch(err => {});

    // confirm passwords
    if (req.body.password != req.body.confPassword) 
        validationErrors.push('Passwords are not identical.');
    
    const newMember = new Member(req.body);

    console.log(req.originalUrl);
    let errorHtml = `<p class="mb-0" style="font-size: 1.8rem;">Please fix the following errors</p>`;
    
    newMember
        .validate()
        .then(user => {
            if (validationErrors.length > 0) {
                validationErrors.forEach(err => errorHtml = errorHtml.concat(`<li>${err}</li>`));
                req.flash('error', errorHtml);
                res.redirect(`${req.originalUrl}?token=${req.body.token}`);
            }
            return newMember.save();
        })
        .then(user => {
            console.log(user);
            req.flash('success', 'Account created successfully. You may login now.')
            res.redirect('/login');
        })
        .catch(err => {
            let fields = ['name', 'password', 'email', 'phone'];
            fields.forEach(field => {
                if (err.errors[field]) 
                    validationErrors.push(err.errors[field].message);
            });
            validationErrors.forEach(err => errorHtml = errorHtml.concat(`<li>${err}</li>`));

            req.flash('error', errorHtml);
            res.redirect(`${req.originalUrl}?token=${req.body.token}`);
        });
}


module.exports = {
    renderHomepage,
    renderLoginPage,
    renderRegisterPage,
    handleRegister
}