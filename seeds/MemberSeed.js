require('dotenv').config();

module.exports = {
    name: process.env.SUPERADMIN_NAME,
    email: process.env.SUPERADMIN_EMAIL,
    password: process.env.SUPERADMIN_PASSWORD,
    role: 'Superadmin',
    phone: process.env.SUPERADMIN_PHONE,
    noticePermissions: {
        createUpdateDeleteSelf: true,
        updateDeleteOthers: true
    },
    achievementPermissions: {
        createUpdateDeleteSelf: true,
        updateDeleteOthers: true
    },
    galleryPermissions: {
        createUpdateDeleteSelf: true,
        updateDeleteOthers: true
    },
    invitePermissions: true,
    eventPermissions: {
        createUpdateDeleteSelf: true,
        updateDeleteOthers: true
    }
}
