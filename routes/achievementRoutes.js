const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/cover',
    filename: function(req, file, cb) {
        cb(null, 'cover' + '-' + Date.now() + path.extname(file.originalname) )
    }
});

const upload = multer({
    storage: storage,
});

const {
    updateAchievement,
    deleteSingleAchievement,
    createNewAchievement,
    showSingleAchievement,
    showAllAchievements
} = require('../controllers/achievementController');

router
    .route('/')
    .get( showAllAchievements )
    .post( upload.single('cover'), createNewAchievement );

router
    .route('/:id')
    .get( showSingleAchievement )
    .delete( deleteSingleAchievement )
    .put( upload.single('cover'), updateAchievement );

module.exports = router;
