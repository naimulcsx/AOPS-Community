const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {Notice} = require('../models');

// validators
const {isAuthenticated} = require('../middlewares/authMiddlewares');
const {userCanCreateNewNotice, userCanDeleteUpdateNotice} = require('../middlewares/noticeMiddlewares');

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
    .post( isAuthenticated, userCanCreateNewNotice, createNewNotice );

router
    .route('/:id')
    .get( showSingleNotice )
    .delete( isAuthenticated, userCanDeleteUpdateNotice, deleteSingleNotice )
    .put( isAuthenticated, userCanDeleteUpdateNotice, updateNotice );

module.exports = router;
