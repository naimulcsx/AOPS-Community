const express = require('express');
const router = express.Router();
const {Event} = require('../models');

const createNewEvent = (req, res) => {
    req.body.createdBy = req.user._id;
    Event
        .create(req.body)
        .then(event => {
            req.flash('success', 'Event created successfully.');
            res.redirect('/dashboard');
        })
        .catch(err => {
            let fields = ['name', 'type', 'startTime', 'finishTime'];
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
            let fields = ['name', 'type', 'startTime', 'finishTime'];
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

router
    .route('/')
    .post( createNewEvent );

router
    .route('/:id')
    .delete( deleteSingleEvent )
    .put( updateSingleEvent );

module.exports = router;