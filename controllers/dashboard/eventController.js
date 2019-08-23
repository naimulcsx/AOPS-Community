const {Event} = require('../../models');

const renderDashboardEventNew = (req, res) => {
    res.render('dashboard/event/new');
}

const renderDashboardEvent = (req, res) => {
    Event
        .find({})
        .populate('createdBy')
        .sort({startTime: -1})
        .then(events => {

            res.render('dashboard/event/index', {
                events
            })
        })
}

const renderDashboardEventUpdate = async(req, res) => {
    try {
        let event = await Event.findOne({_id: req.params.id});
        res.render('dashboard/event/update', {
            event
        });
    } catch(err) {

    }
}

module.exports = {
    renderDashboardEvent,
    renderDashboardEventNew,
    renderDashboardEventUpdate
}