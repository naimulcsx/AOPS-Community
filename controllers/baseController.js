const {Notice, Member, Achievement, Gallery, Event} = require('../models');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const renderHomepage = async(req, res) => {
    Notice
        .find({public: true})
        .sort({created: -1})
        .limit( res.locals.AOPSInfo.numberOfNoticesOnHomepage )
        .then(async(notices) => {
            try {
                let achievements = 
                    await Achievement
                        .find({})
                        .sort({created: -1})
                        .limit(res.locals.AOPSInfo.numberOfAchievementsOnHomepage);

                let galleries = 
                    await Gallery 
                        .find()
                        .sort({created: -1})
                        .limit(res.locals.AOPSInfo.numberOfGalleryOnHomepage)


                let eventsArr = 
                    await Event
                        .find({})
                        .sort({startTime: 1});

                let events = [], max = res.locals.AOPSInfo.numberOfEventsOnHomepage, cnt = 0;
                for (let i = 0; i < eventsArr.length; ++i) {
                    if ( moment(eventsArr[i].startTime).isAfter() && cnt < max ) {
                        events.push(eventsArr[i]);
                        cnt++;
                    }
                }
                
                
                

                res.render('index', {
                    notices,
                    achievements,
                    galleries,
                    events
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
    console.log(req.body);
    let validationErrors = [];

    // check if the email is used with other account
    try {
        let user = await Member.findOne({email: req.body.email});  
        if (user) validationErrors.push('Email is already used.');
    } catch(err) { }

    // roles must be any one of the below
    const accountTypes = ['Member', 'Faculty Member', 'Executive Member', 'Lab Assistant', 'Office Staff'];

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
        return res.redirect('/login');
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
    
    // set permissons to the assigned role
    if (req.body.role === 'Executive Member' || req.body.role === 'Faculty Member') {
        
        req.body.noticePermissions = req.body.galleryPermissions = req.body.eventPermissions = {
            createUpdateDeleteSelf: true,
            updateDeleteOthers: false,
        }
        req.body.invitePermissions = true;

        // if Faculty member
        if (req.body.role == 'Faculty Member') {
            req.body.achievementPermissions = {
                createUpdateDeleteSelf: true,
                updateDeleteOthers: false
            }
        }
    }
    
    const newMember = new Member(req.body);    
    let errorHtml = `<p class="mb-0" style="font-size: 1.8rem;">Please fix the following errors</p>`;
    
    newMember
        .validate()
        .then(user => {
            if (validationErrors.length > 0) {
                validationErrors.forEach(err => errorHtml = errorHtml.concat(`<li>${err}</li>`));
                req.flash('error', errorHtml);
                return res.redirect(`${req.originalUrl}?token=${req.body.token}`);
            }
            return newMember.save();
        })
        .then(user => {
            console.log(user);
            req.flash('success', 'Account created successfully. You may login now.')
            return res.redirect('/login');
        })
        .catch(err => {
            let fields = ['name', 'password', 'email', 'phone'];
            fields.forEach(field => {
                if (err.errors[field]) 
                    validationErrors.push(err.errors[field].message);
            });
            validationErrors.forEach(err => errorHtml = errorHtml.concat(`<li>${err}</li>`));

            req.flash('error', errorHtml);
            return res.redirect(`${req.originalUrl}?token=${req.body.token}`);
        });
}


module.exports = {
    renderHomepage,
    renderLoginPage,
    renderRegisterPage,
    handleRegister
}