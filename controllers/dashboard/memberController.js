const sgMail = require('@sendgrid/mail');
const {Member} = require('../../models');
const jwt = require('jsonwebtoken');
const validator = require('validator');
sgMail.setApiKey('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');

const renderMemberInvite = async(req, res) => {
    res.render('dashboard/members/invite');
}

const inviteMember = async(req, res) => {
    const AOPSInfo = res.locals.AOPSInfo;
    
    // if an user with the email exists, give flash message
    try {
        const user = await Member.findOne({email: req.body.email});
        if ( user ) {
            req.flash('error', 'User exists with the email.');
            return res.redirect('/dashboard/member/invite');
        }
    } catch(err) { }

    // otherwise generate a jwt
    const accountTypes = ['Member', 'Faculty Member', 'Executive Member', 'Lab Assistant', 'Office Staff'];
    const roleId = parseInt(req.body.role) - 1;
    const invitationRole = accountTypes[roleId];


    const expirationTime = '48h';

    const token = jwt.sign({
        name: req.body.name,
        email: req.body.email,
        role: invitationRole
    }, 'super_secret', {expiresIn: expirationTime});

    console.log(token);

    const msg = {
        to: req.body.email,
        from: `${AOPSInfo.contactEmail}`,
        subject: `Invitation - ${AOPSInfo.name} ${AOPSInfo.type}`,
        html: `<!doctype html><html> <head> <meta name="viewport" content="width=device-width"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>Simple Transactional Email</title> <style>/* ------------------------------------- INLINED WITH htmlemail.io/inline ------------------------------------- */ /* ------------------------------------- RESPONSIVE AND MOBILE FRIENDLY STYLES ------------------------------------- */ @media only screen and (max-width: 620px){table[class=body] h1{font-size: 28px !important; margin-bottom: 10px !important;}table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a{font-size: 16px !important;}table[class=body] .wrapper, table[class=body] .article{padding: 10px !important;}table[class=body] .content{padding: 0 !important;}table[class=body] .container{padding: 0 !important; width: 100% !important;}table[class=body] .main{border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important;}table[class=body] .btn table{width: 100% !important;}table[class=body] .btn a{width: 100% !important;}table[class=body] .img-responsive{height: auto !important; max-width: 100% !important; width: auto !important;}}/* ------------------------------------- PRESERVE THESE STYLES IN THE HEAD ------------------------------------- */ @media all{.ExternalClass{width: 100%;}.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height: 100%;}.apple-link a{color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important;}#MessageViewBody a{color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit;}.btn-primary table td:hover{background-color: #34495e !important;}.btn-primary a:hover{background-color: #34495e !important; border-color: #34495e !important;}}</style> </head> <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"> <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td><td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;"> <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;"> <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">This is preheader text. Some clients will show this text as a preview.</span> <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;"> <tr> <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;"> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello, ${req.body.name}</p><p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Welcome to ${AOPSInfo.name} ${AOPSInfo.type}. To resigter you account please click the link given below before expiring in 24 hours. Best of Luck !! </p><table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;"> <tbody> <tr> <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;"> <tbody> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <a href=\`http://localhost:3000/register?token=${token}\` target="_blank" style="display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #3498db;">Register</a> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></table> </td></tr></table> <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;"> <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">2019 &copy; ${AOPSInfo.name}${AOPSInfo.type}</span> </td></tr><tr> </tr></table> </div></div></td><td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td></tr></table> </body></html>`,
    };

    sgMail
        .send(msg)
        .then(data => {
            req.flash('success', `Successfully invited ${req.body.name}. The invitation link will expire in ${expirationTime}.`);
            res.redirect('/dashboard/member/invite');
        })
        .catch(err => {
            req.flash('error', `Couldn't send invitation.`);
            res.redirect('/dashboard/member/invite');
        });
}

const handleAuthorize = async (req, res, next) => {
    try {
        let foundUser = await Member.findOne({email: req.body.email});

        // if there is no user
        if (!foundUser) {
            req.flash('error', 'Member not found');
            return res.redirect('/dashboard/member/authorize');
        }

        // if user is the superadmin
        if (foundUser.role === 'Superadmin') {
            req.flash('error', 'Superadmin can not be authorized.');
            return res.redirect('/dashboard/member/authorize');
        }

        // if there is a user
        res.render('dashboard/members/authorize', {
            foundUser
        });
    } catch(err) { }
}

const renderAuthorize = (req, res) => {
    res.render('dashboard/members/authorize');
}

const handleUpdateAuthorizedMember = (req, res) => {
    res.send(req.body);
}


module.exports = {
    renderMemberInvite,
    inviteMember,
    renderAuthorize,
    handleAuthorize,
    handleUpdateAuthorizedMember
}