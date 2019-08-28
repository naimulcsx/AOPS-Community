const {Event, Gallery, Member} = require('../models');

const showAllEvents = async(req, res) => {

    const eventsPerPage = res.locals.AOPSInfo.numberOfEventsOnEventsPage;
    let skipCount = 0, currentPage = 1;

    const documentCount = await Event.countDocuments({});
    const paginateCount = Math.ceil(documentCount / eventsPerPage);

    if (req.query.page && parseInt(req.query.page) > 0) {
        currentPage = parseInt(req.query.page);
        skipCount = currentPage - 1;
    }

    const events = 
        await Event
            .find({})
            .sort({startTime: -1})
            .limit(eventsPerPage)
            .skip(skipCount * eventsPerPage);

    res.render('event/index', {
        events,
        paginateCount,
        currentPage,
    });
}

const viewSingleEvent = (req, res) => {
    Event.findOne({_id: req.params.id})
        .then(async (event) => {
            if (!event) {
                req.flash('error', 'Event doesn\'t exists');
                return res.redirect('/event');
            }   

            let gallery = null;
            try {
                gallery = await Gallery.findOne({_id: event.galleryId});
            } catch(err) { }
            
            res.render('event/single', {
                event,
                gallery
            })
        })
        .catch( err => { 
            req.flash('error', 'Notice doesn\'t exist.');
            return res.redirect('/event');
        });
}

const createNewEvent = (req, res) => {
    req.body.createdBy = req.user._id;
    Event
        .create(req.body)
        .then(event => {
            Member
                .findById(req.user._id)
                .then(async (user) =>{
                    user.eventsPosted.push(event);
                    await user.save();
                });

            req.flash('success', 'Event created successfully.');
            res.redirect('/dashbooard/event');
        })
        .catch(err => {
            let fields = ['name', 'type', 'startTime', 'finishTime', 'location'];
            let validationErrors = [];

            for (let i = 0; i < fields.length; ++i) {
                if ( err.errors[fields[i]] )
                    validationErrors.push( err.errors[fields[i]].message );
            }
            console.log(validationErrors);
            res.render('dashboard/event/new', {
                validationErrors
            })
        });
}

const deleteSingleEvent = async (req, res) => {
    let data = await Event.findOneAndDelete({_id: req.params.id});

    if ( !data ) {
        req.flash('error', 'The event doesn\'t exist.');
        res.redirect('/dashboard/event');
        return;
    }

    req.flash('success', 'Successfully deleted the event.');
    res.redirect('/dashboard/event');
}

const updateSingleEvent = async(req, res) => {
    let data = await Event.findOne({_id: req.params.id});
    if (!data) {
        req.flash('error', 'Event not found!');
        res.redirect('/dashboard/event');
    }


    new Event(req.body)
        .validate()
        .then(async (data) => {
            try {
                let savedData = await Event.findOneAndUpdate( {_id: req.params.id}, req.body )
                req.flash('success', 'Successfully update the event.');
                res.redirect('/dashboard/event');
            } catch(err) { console.log(err) }
        })
        .catch((err) => {
            let fields = ['name', 'type', 'startTime', 'finishTime', 'location'];
            let validationErrors = [];

            for (let i = 0; i < fields.length; ++i) {
                if ( err.errors[fields[i]] )
                    validationErrors.push( err.errors[fields[i]].message );
            }
            
            Event.findOne({_id: req.params.id})
                .then(event => {
                    res.render('dashboard/event/update', {
                        event,
                        validationErrors
                    })
                })
                .catch(err => console.log(err))
        });    
}

module.exports = {
    createNewEvent,
    deleteSingleEvent,
    updateSingleEvent,
    showAllEvents,
    viewSingleEvent
}