const {AOPS, Member, Event, Notice, Gallery, Achievement} = require('../../models');
const bcrypt = require('bcrypt');
const fs = require('fs');

const renderDashboard = async (req, res) => {
    const achievementCount = await Achievement.countDocuments({});
    const noticeCount = await Notice.countDocuments({});
    const eventCount = await Event.countDocuments({});
    const galleryCount = await Gallery.countDocuments({});
    const memberCount = await Member.countDocuments({});

    res.render('dashboard/index', {
        achievementCount,
        noticeCount,
        eventCount,
        galleryCount,
        memberCount
    });
}

const renderSettingsGeneral = async (req, res) => {
    res.render('dashboard/settings/general');
}

const updateAOPSInfo = async(req, res) => {
    const AOPSInfoObj = res.locals.AOPSInfo;
    const id = res.locals.AOPSInfo._id;


    for (let prop in req.body) {
        let addressFields = ['city', 'country', 'zip'];
        let socialFields = ['facebook', 'twitter'];
        if (prop === '_id') continue;
        if ( addressFields.includes(prop) ) AOPSInfoObj.address[prop] = req.body[prop];
        else if ( socialFields.includes(prop) ) AOPSInfoObj.social[prop] = req.body[prop];
        else AOPSInfoObj[prop] = req.body[prop];
    }

    

    // handle logo file upload from req.file
    if (req.file) {
        AOPSInfoObj.logo = req.file.path;
        // if we have an old logo, delete it
        let data = await AOPS.findById(id);
        if ( data.logo ) {
            let path = `.\\${data.logo}`;
            fs.unlinkSync(path);
        }
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
    res.render('dashboard/settings/about');
}

const renderAccountSettings = (req, res) => {
    res.render('dashboard/settings/account');
}

const updateAccountInfo = async (req, res) => {
    console.log(req.body);
    console.log(req.file);

    const deletePreviouslyUploadedPhoto = () => {
        if (req.file) {
            let path = `.\\${req.file.path}`;
            fs.unlinkSync(path);
        }
    }

    let errors = [], user = {};
    req.body.role = req.user.role;

    // if there is no current password
    if ( !req.body.passwordOld ) {
        // if photo was uploaded, delete the uploaded photo
        deletePreviouslyUploadedPhoto();

        req.flash('error', 'Please enter your old password to update account informations');
        return res.redirect('/dashboard/settings/account');
    }

    if (req.file) {
        req.body.photo = req.file.path;
        try {
            let account = await Member.findById(req.user._id);
            console.log(account);
            if (account.photo) {
                let path = `.\\${account.photo}`;
                fs.unlinkSync(path);
            }
        } catch(err) {
            req.flash('error', 'Couldn\'t update account informations.');
            return res.redirect('/dashboard/settings/account');
        }
    }

    // if the current password is incorrect
    let passwordCorrect = await bcrypt.compare(req.body.passwordOld, req.user.password);
    if (!passwordCorrect) {
        deletePreviouslyUploadedPhoto();
        req.flash('error', 'Current password is incorrect');
        return res.redirect('/dashboard/settings/account');
    }

    // if there is no new password
    if (!req.body.password) req.body.password = req.body.passwordOld;


    let errorHtml = '', newUser = new Member(req.body);

    newUser
        .validate()
        .then(async(user) => {
            try {
                let user =  await Member.findByIdAndUpdate(req.user._id, req.body);
                req.flash('success', 'Your account information has been updated');
                return res.redirect('/dashboard/settings/account');
            } catch(err) { }
        })
        .catch(err => {
            deletePreviouslyUploadedPhoto();

            let fields = ['name', 'password', 'email', 'phone'];
            fields.forEach(field => {
                if (err.errors[field]) 
                    errors.push(err.errors[field].message);
            });
            errors.forEach(err => errorHtml = errorHtml.concat(`<li>${err}</li>`));
            req.flash('validationError', errorHtml);
            return res.redirect('/dashboard/settings/account');
        });
}

module.exports = {
    renderDashboard,
    renderSettingsGeneral,
    updateAOPSInfo,
    renderAboutCommunity,
    renderAccountSettings,
    updateAccountInfo
}