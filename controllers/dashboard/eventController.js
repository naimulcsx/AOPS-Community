const {Event} = require('../../models');
const moment = require('moment');

const renderDashboardEventNew = (req, res) => {
    res.render('dashboard/event/new');
}

const renderDashboardEvent = (req, res) => {
    Event
        .find({})
        .populate('createdBy')
        .sort({startTime: 1})
        .then(events => {
            

            let eventsUpcoming = events.filter(event => {
                return moment(event.startTime).isAfter();
            });

            let eventsEnded = events.filter(event => {
                return moment(event.startTime).isBefore();
            });

            events = eventsUpcoming.concat(eventsEnded);


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