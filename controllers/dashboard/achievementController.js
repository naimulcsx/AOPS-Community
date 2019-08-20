const {Achievement} = require('../../models');

const renderDashboardAchievement = async (req, res) => {
    const achievements = 
        await Achievement
            .find({})
            .populate('createdBy')
            .sort({created: -1});
            
    res.render('dashboard/achievement/index', {
        achievements,
    });
}

const renderDashboardAchievementNew = async (req, res) => {
    res.render('dashboard/achievement/new');
}

const renderUpdateAchievement = async(req, res) => {
    const achievement = await Achievement.findById(req.params.id);
    res.render('dashboard/achievement/update', {
        achievement 
    });
}

module.exports = {
    renderDashboardAchievement,
    renderDashboardAchievementNew,
    renderUpdateAchievement
}