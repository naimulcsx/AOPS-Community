const {Notice, AOPS} = require('.././models');
const striptags = require('striptags');
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
    });
}

const showSingleNotice = async (req, res) => {

    // if the objectId is not valid
    if ( !ObjectId.isValid(req.params.id) ) {
        req.flash('error', 'Notice doesn\'t exist.');
        res.redirect('/notice');
        return;
    }

    // find the Notice
    let notice = await Notice.findById( {_id: req.params.id} );

    // if no notice of the objectId exist
    if ( !notice ) {
        req.flash('error', 'Notice doesn\'t exist.');
        res.redirect('/notice');
    }

    // if every thing goes okay
    res.render('notice/single', {
        notice,
    });
}


const createNewNotice = (req, res) => {
    console.log(req.body);
    req.body.createdBy = req.user._id;
    if (req.body.private === 'on') req.body.public = false;
    Notice
        .create(req.body)
        .then(notice => {
            req.flash('success', 'Notice created successfully.');
            res.redirect('/dashboard/notice');
        })
        .catch(err => {
            res.redirect('/dashboard/notice/new');
        });
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