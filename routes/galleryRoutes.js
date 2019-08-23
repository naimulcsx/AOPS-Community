const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const uuidv1 = require('uuid/v1');
const {Gallery} = require('../models');


const {showSingleGallery, createNewGallery, deleteSingleGallery, updateSingleGallery, showAllGalleries} = require('../controllers/galleryController');
const { userCanCreateNewGallery, userCanDeleteUpdateGallery } = require('../middlewares/galleryMiddlewares')
const { isAuthenticated } = require('../middlewares/authMiddlewares');

const storage = multer.diskStorage({
    destination: './uploads/album_images',
    filename: function(req, file, cb) {
        cb(null, uuidv1() + path.extname(file.originalname) );
    }
});

const upload = multer({
    storage: storage,
});


router
    .route('/')
    .get( showAllGalleries )
    .post( isAuthenticated, userCanCreateNewGallery, upload.array('album'), createNewGallery );

router
    .route('/:id')
    .get( showSingleGallery ) // public
    .put( isAuthenticated, userCanDeleteUpdateGallery, upload.array('album'), updateSingleGallery  )
    .delete( isAuthenticated, userCanDeleteUpdateGallery, deleteSingleGallery );

module.exports = router;