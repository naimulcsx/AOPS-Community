const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');


/* Validators */
const {isAuthenticated} = require('../middlewares/authMiddlewares');
const {userCanCreateNewAchievement, userCanDeleteUpdateAchievement} = require('../middlewares/achievementMiddlewares');

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
    .post( isAuthenticated, userCanCreateNewAchievement, upload.single('cover'), createNewAchievement );

router
    .route('/:id')
    .get( showSingleAchievement )
    .delete(isAuthenticated, userCanDeleteUpdateAchievement, deleteSingleAchievement )
    .put(isAuthenticated, userCanDeleteUpdateAchievement, upload.single('cover'), updateAchievement );

module.exports = router;
