const {Notice} = require('../models');


const isSuperAdmin = user => user.role === 'Superadmin';

const canPostNotices = user => user.canPostNotices;

const isNoticePostedByTheUser = async(noticeId, user) => {
    let notice = await Notice.findById(noticeId).populate('createdBy');
    return notice.createdBy._id.equals(user._id);
}

module.exports = {
    isSuperAdmin, 
    canPostNotices,
    isNoticePostedByTheUser
}