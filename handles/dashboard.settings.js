const {AOPS} = require('../models');

const renderDashboard = async (req, res) => {
    res.render('dashboard/index');
}

const renderSettingsGeneral = async (req, res) => {
    res.render('dashboard/settings/general');
}

const updateAOPSInfo = async(req, res) => {
    const AOPSInfoObj = res.locals.AOPSInfo;
    const id = res.locals.AOPSInfo._id;

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
    res.render('dashboard/settings/about');
}

const renderAccountSettings = (req, res) => {
    res.render('dashboard/settings/account');
}

const updateAccountInfo = (req, res) => {
    req.body.role = req.user.role;
    res.send('hello world');
}

module.exports = {
    renderDashboard,
    renderSettingsGeneral,
    updateAOPSInfo,
    renderAboutCommunity,
    renderAccountSettings,
    updateAccountInfo
}