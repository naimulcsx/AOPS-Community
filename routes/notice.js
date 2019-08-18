const express = require('express');
const router = express.Router();


const {
    showAllNotices,
    createNewNotice,
    deleteSingleNotice,
    updateNotice,
    showSingleNotice
} = require('../handles/notice');

router
    .route('/')
    .get( showAllNotices )
    .post( createNewNotice );

router
    .route('/:id')
    .get( showSingleNotice )
    .delete( deleteSingleNotice )
    .put( updateNotice );

module.exports = router;
