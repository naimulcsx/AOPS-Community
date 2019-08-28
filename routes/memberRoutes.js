const express = require('express');
const router = express.Router();
const {Member, Notice, Achievement, Event, Album, Gallery} = require('../models');
const ObjectId = mongoose.Types.ObjectId;

const showSingleMember = async (req, res) => {
    // if the objectId is not valid
    if ( !ObjectId.isValid(req.params.id) ) {
        req.flash('error', 'Notice doesn\'t exist.');
        res.redirect('/member');
        return;
    }

    // find the member
    let member = await Member.findById( {_id: req.params.id} )
        .populate('noticesPosted')
        .populate('achievementsPosted')
        .populate('eventsPosted')
        .populate('galleriesPosted');


    // if no member of the objectId exist
    if ( !member ) {
        req.flash('error', 'Member doesn\'t exist.');
        res.redirect('/member');
        return;
    }

    // if every thing goes okay
    res.render('member/single', {
        member,
    });
}


const showAllMembers = async (req, res) => {
    const membersPerPage = 6;
    let skipCount = 0, currentPage = 1;
    const documentCount = await Member.countDocuments({});
    const paginateCount = Math.ceil(documentCount / membersPerPage);

    if (req.query.page && parseInt(req.query.page) > 0) {
        currentPage = parseInt(req.query.page);
        skipCount = currentPage - 1;
    }

    const members = 
        await Member
            .find({})
            .limit(membersPerPage)
            .skip(skipCount * membersPerPage);

    res.render('member/index', {
        members,
        paginateCount,
        currentPage
    });
}


const showAllExecutive = async (req, res) => {
    const membersPerPage = 6;
    let skipCount = 0, currentPage = 1;
    const documentCount = await Member.countDocuments({role: 'Executive Member'});
    const paginateCount = Math.ceil(documentCount / membersPerPage);

    if (req.query.page && parseInt(req.query.page) > 0) {
        currentPage = parseInt(req.query.page);
        skipCount = currentPage - 1;
    }

    const members = 
        await Member
            .find({role: 'Executive Member'})
            .limit(membersPerPage)
            .skip(skipCount * membersPerPage);

    res.render('member/executive', {
        members,
        paginateCount,
        currentPage
    });
}

router
    .route('/')
    .get( showAllMembers );

    
router
    .route('/executive')
    .get( showAllExecutive );

router
    .route('/:id')
    .get( showSingleMember );

    

module.exports = router;