const express = require('express');
const router = express.Router();
const {Notice, AOPS} = require('.././models');
const striptags = require('striptags');
const ObjectId = mongoose.Types.ObjectId;

const showAllNotices = async (req, res) => {
    const AOPSInfo = await AOPS.find({});
    const AOPSInfoObj = AOPSInfo[0];
    const noticesPerPage = 5;

    let skipCount = 0, currentPage = 1;

    const documentCount = await Notice.countDocuments({});
    const paginateCount = Math.ceil(documentCount / noticesPerPage);

    if (req.query.page && parseInt(req.query.page) > 0) {
        currentPage = parseInt(req.query.page);
        skipCount = currentPage - 1;
    }


    const notices = 
        await Notice
            .find({})
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
        AOPSInfo: AOPSInfoObj,
        paginateCount,
        currentPage,
    });
}



const showSingleNotice = async (req, res) => {
    const AOPSInfo = await AOPS.find({});
    const AOPSInfoObj = AOPSInfo[0];

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
        AOPSInfo: AOPSInfoObj
    });
}


const createNewNote = (req, res) => {
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
    let data = await Notice.findByIdAndDelete(req.params.id);

    if ( !data ) {
        req.flash('error', 'The notice doesn\'t exist.');
        res.redirect('/dashboard/notice');
        return;
    }

    req.flash('success', 'Successfully deleted the notice.');
    res.redirect('/dashboard/notice');
}


const updateNotice = async(req, res) => {
    Notice.findByIdAndUpdate(req.params.id, req.body)
        .then(arr => {
            req.flash('success', 'Successfully updated the notice.');
            res.redirect('/dashboard/notice');
        })
        .catch(err => {
            req.flash('error', 'Couldn\'t update the notice.');
            res.redirect('/dashboard/notice');
        });
}

router
    .route('/')
    .get( showAllNotices )
    .post( createNewNote );

router
    .route('/:id')
    .get( showSingleNotice )
    .delete( deleteSingleNotice )
    .put( updateNotice );

module.exports = router;
