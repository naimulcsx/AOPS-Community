const express = require('express');
const router = express.Router();
const {Member} = require('../models');
const ObjectId = mongoose.Types.ObjectId;

const showSingleMember = async (req, res) => {
    // if the objectId is not valid
    if ( !ObjectId.isValid(req.params.id) ) {
        req.flash('error', 'Notice doesn\'t exist.');
        res.redirect('/member');
        return;
    }

    // find the Notice
    let member = await Member.findById( {_id: req.params.id} );

    // if no notice of the objectId exist
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

router
    .route('/:id')
    .get( showSingleMember );

module.exports = router;