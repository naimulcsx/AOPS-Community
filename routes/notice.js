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


    console.log(req.query);

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
        errorMessage: req.flash('error'),
        paginateCount,
        currentPage
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

router
    .route('/')
    .get( showAllNotices );

router
    .route('/:id')
    .get(showSingleNotice);

module.exports = router;
