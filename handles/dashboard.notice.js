const {Notice, AOPS} = require('.././models');

const renderDashboardNotice = async (req, res) => {
    const notices = 
        await Notice
        .find({})
        .sort({created: -1});

    res.render('dashboard/notice/index', {
        notices,
    });
}

const renderDashboardNoticeNew = async (req, res) => {
    res.render('dashboard/notice/new');
}

const renderUpdateNotice = async(req, res) => {
    const notice = await Notice.findById(req.params.id);
    res.render('dashboard/notice/update', {
        notice 
    });
}

module.exports = {
    renderDashboardNotice,
    renderDashboardNoticeNew,
    renderUpdateNotice
}