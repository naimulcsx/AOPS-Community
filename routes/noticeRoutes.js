const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/cover',
    filename: function(req, file, cb) {
        cb(null, 'cover' + '-' + Date.now() + path.extname(file.originalname) )
    }
})

const upload = multer({
    storage: storage,
});

const {
    showAllNotices,
    createNewNotice,
    deleteSingleNotice,
    updateNotice,
    showSingleNotice
} = require('../controllers/noticeController');

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
