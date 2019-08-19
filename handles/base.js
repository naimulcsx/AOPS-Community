const {Notice, Member} = require('../models');

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
    res.render('register');
}

const handleRegister = async (req, res) => {
    let validationErrors = [];

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
                if (err.errors[field]) validationErrors.push(err.errors[field].message);
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