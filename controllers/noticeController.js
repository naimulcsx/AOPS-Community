const {Notice, Event, Member} = require('.././models');
const striptags = require('striptags');
const moment = require('moment');
const ObjectId = mongoose.Types.ObjectId;

const showAllNotices = async (req, res) => {

    const noticesPerPage = res.locals.AOPSInfo.numberOfNoticesOnNoticeIndex;
    let skipCount = 0, currentPage = 1;

    const documentCount = await Notice.countDocuments({public: true});
    const paginateCount = Math.ceil(documentCount / noticesPerPage);

    if (req.query.page && parseInt(req.query.page) > 0) {
        currentPage = parseInt(req.query.page);
        skipCount = currentPage - 1;
    }

    const notices = 
        await Notice
            .find({public: true})
            .sort({created: -1})
            .limit(noticesPerPage)
            .skip(skipCount * noticesPerPage);

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

    notices.forEach(notice => {
        notice.excerpt = 
            striptags(notice.desc)
                .split(" ")
                .splice(0, 35)
                .join(" ");
    });

    res.render('notice/index', {
        notices,
        paginateCount,
        currentPage,
        events,
        eventsEnded
    });
}

const showSingleNotice = async (req, res) => {
    // find the Notice
    Notice.findOne({_id: req.params.id})
        .then(async (notice) => {
            if ( !notice ) {
                req.flash('error', 'Notice doesn\'t exist.');
                return res.redirect('/notice');
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
            res.render('notice/single', {
                notice,
                events,
                eventsEnded
            });
        })
        .catch(err => {
            // if no notice of the objectId exist
            req.flash('error', 'Notice doesn\'t exist.');
            return res.redirect('/notice');
        });
}


const createNewNotice = (req, res) => {
    console.log(req.body);
    req.body.createdBy = req.user._id;
    if (req.body.private === 'on') req.body.public = false;

    new Notice(req.body)
        .validate()
        .then(notice => {

            Notice.create(req.body)
                .then(notice => {
                    Member
                        .findById(req.user._id)
                        .then(async (user) => {
                            user.noticesPosted.push(notice);
                            await user.save();
                        });

                    req.flash('success', 'Notice created successfully.');
                    res.redirect('/dashboard/notice');
                })
                .catch(err => {
                    res.redirect('/dashboard/notice/new');
                });


            
        })
        .catch(err => {
            let fields = ['title', 'desc'];
            let validationErrors = [];

            for (let i = 0; i < fields.length; ++i) {
                if ( err.errors[fields[i]] )
                    validationErrors.push( err.errors[fields[i]].message );
            }

            res.render('dashboard/notice/new', {
                validationErrors
            });
        })
}

const deleteSingleNotice = async (req, res) => {
    let data = await Notice.findOneAndDelete({_id: req.params.id});

    if ( !data ) {
        req.flash('error', 'The notice doesn\'t exist.');
        res.redirect('/dashboard/notice');
        return;
    }

    req.flash('success', 'Successfully deleted the notice.');
    res.redirect('/dashboard/notice');
}


const updateNotice = async(req, res) => {
    if (req.body.private === 'on') req.body.public = false;
    if (!req.body.private) req.body.public = true;


    new Notice(req.body)
        .validate()
        .then(data => {
            Notice.findOneAndUpdate({_id: req.params.id}, req.body)
                .then(arr => {
                    req.flash('success', 'Successfully updated the notice.');
                    res.redirect('/dashboard/notice');
                })
                .catch(err => {
                    req.flash('error', 'Couldn\'t update the notice.');
                    res.redirect('/dashboard/notice');
                });
        })
        .catch(err => {
            let fields = ['title', 'desc'];
            let validationErrors = [];

            for (let i = 0; i < fields.length; ++i) {
                if ( err.errors[fields[i]] )
                    validationErrors.push( err.errors[fields[i]].message );
            }


            Notice.findOne({_id: req.params.id})
                .then( notice => {
                    res.render('dashboard/notice/update', {
                        notice, 
                        validationErrors
                    })
                })
                .catch(err => console.log(err));
        });
}


module.exports = {
    updateNotice,
    deleteSingleNotice,
    createNewNotice,
    showSingleNotice,
    showAllNotices
}