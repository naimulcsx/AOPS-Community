const {Achievement, Event, Member} = require('../models');
const striptags = require('striptags');
const fs = require('fs');
const moment = require('moment');
const ObjectId = mongoose.Types.ObjectId;

const showAllAchievements = async (req, res) => {

    const noticesPerPage = res.locals.AOPSInfo.numberOfAchievementsOnAchievementPage;
    let skipCount = 0, currentPage = 1;

    const documentCount = await Achievement.countDocuments({});
    const paginateCount = Math.ceil(documentCount / noticesPerPage);

    if (req.query.page && parseInt(req.query.page) > 0) {
        currentPage = parseInt(req.query.page);
        skipCount = currentPage - 1;
    }

    const achievements = 
        await Achievement
            .find({})
            .sort({created: -1})
            .limit(noticesPerPage)
            .skip(skipCount * noticesPerPage);


    achievements.forEach(achievement => {
        achievement.excerpt = 
            striptags(achievement.desc)
                .split(" ")
                .splice(0, 35)
                .join(" ");
    });


    let eventsArr = 
            await Event
                .find({})
                .sort({startTime: 1});

    let eventsAfter = eventsArr.filter(event => moment(event.startTime).isAfter());
    let eventsBefore = eventsArr.filter(event => moment(event.startTime).isBefore());
    eventsBefore = eventsBefore.reverse();

    let events = [], max = 5, cnt = 0;
    for (let i = 0; i < eventsAfter.length; ++i) {
        if ( cnt < max ) {
            events.push(eventsAfter[i]);
            cnt++;
        }
    }

    cnt = 0;
    let eventsEnded = [];
    for (let i = 0; i < eventsBefore.length; ++i) {
        if ( cnt < max ) {
            eventsEnded.push(eventsBefore[i]);
            cnt++;
        }
    }

    res.render('achievement/index', {
        achievements,
        paginateCount,
        currentPage,
        events,
        eventsEnded
    });
}

const showSingleAchievement = (req, res) => {
    // find the Notice
    Achievement.findById( {_id: req.params.id} )
        .then(async (achievement) => {
            // if no notice of the objectId exist
            if ( !achievement ) {
                req.flash('error', 'Achievement doesn\'t exist.');
                res.redirect('/achievement');
            }

            let eventsArr = 
            await Event
                .find({})
                .sort({startTime: 1});

            let eventsAfter = eventsArr.filter(event => moment(event.startTime).isAfter());
            let eventsBefore = eventsArr.filter(event => moment(event.startTime).isBefore());
            eventsBefore = eventsBefore.reverse();

            let events = [], max = 5, cnt = 0;
            for (let i = 0; i < eventsAfter.length; ++i) {
                if ( cnt < max ) {
                    events.push(eventsAfter[i]);
                    cnt++;
                }
            }

            cnt = 0;
            let eventsEnded = [];
            for (let i = 0; i < eventsBefore.length; ++i) {
                if ( cnt < max ) {
                    eventsEnded.push(eventsBefore[i]);
                    cnt++;
                }
            }

            // if every thing goes okay
            res.render('achievement/single', {
                achievement,
                events,
                eventsEnded
            });
        }) 
        .catch(err => {
            req.flash('error', 'Achievement doesn\'t exist.');
             return res.redirect('/achievement');
        });
}


const createNewAchievement = (req, res) => {
    req.body.createdBy = req.user._id;
    if (req.file) req.body.cover = req.file.path;
    
    Achievement
        .create(req.body)
        .then(achievement => {
            Member
                .findById(req.user._id)
                .then(async (user) =>{
                    user.achievementsPosted.push(achievement);
                    await user.save();
                });
            req.flash('success', 'Achievement created successfully.');
            res.redirect('/dashboard/achievement');
        })
        .catch(err => {
            res.redirect('/dashboard/achievement/new');
        });
}

const deleteSingleAchievement = async (req, res) => {

    // delete the photo from uploads
    let data = await Achievement.findById(req.params.id);
    if ( data.cover ) {
        let path = `.\\${data.cover}`;
        fs.unlinkSync(path);
    }

    // delete from database
    data = await Achievement.findByIdAndDelete(req.params.id);
    if ( !data ) {
        req.flash('error', 'The achievement doesn\'t exist.');
        res.redirect('/dashboard/achievement');
        return;
    }

    // if successfully deleted
    req.flash('success', 'Successfully deleted the achievement.');
    res.redirect('/dashboard/achievement');
}


const updateAchievement = async(req, res) => {
    if (req.file) {
        req.body.cover = req.file.path;
        // Delete the previous achievement cover
        try {
            let achievement = await Achievement.findById(req.params.id);
            if (achievement.cover) {
                let path = `.\\${achievement.cover}`;
                fs.unlinkSync(path);
            }
        } catch(err) {
            req.flash('error', 'Couldn\'t update the achievement.');
            return res.redirect('/dashboard/achievement');
        }
    }

    
    new Achievement(req.body)
        .validate()
        .then(data => {

            Achievement.findByIdAndUpdate(req.params.id, req.body)
                .then(arr => {
                    req.flash('success', 'Successfully updated the achievement.');
                    res.redirect('/dashboard/achievement');
                })
                .catch(err => {
                    req.flash('error', 'Couldn\'t update the achievement.');
                    res.redirect('/dashboard/achievement');
                });

        })
        .catch(err => {
            let fields = ['title', 'desc'];
            let validationErrors = [];

            for (let i = 0; i < fields.length; ++i) {
                if ( err.errors[fields[i]] )
                    validationErrors.push( err.errors[fields[i]].message );
            }

            Achievement.findOne({_id: req.params.id})
                .then( achievement => {
                    res.render('dashboard/achievement/update', {
                        achievement, 
                        validationErrors
                    })
                })
                .catch(err => console.log(err));
        });
}


module.exports = {
    updateAchievement,
    deleteSingleAchievement,
    createNewAchievement,
    showSingleAchievement,
    showAllAchievements
}