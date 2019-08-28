const express = require('express');
const router = express.Router();

const {createNewEvent, deleteSingleEvent, updateSingleEvent, showAllEvents, viewSingleEvent} = require('../controllers/eventController');
const {userCanCreateNewEvent, userCanDeleteUpdateEvent} = require('../middlewares/eventMiddlewares');
const {isAuthenticated} = require('../middlewares/authMiddlewares');

router
    .route('/')
    .get( showAllEvents )
    .post( isAuthenticated, userCanCreateNewEvent, createNewEvent );

router
    .route('/:id')
    .get( viewSingleEvent )
    .delete( isAuthenticated, userCanDeleteUpdateEvent, deleteSingleEvent )
    .put( isAuthenticated, userCanDeleteUpdateEvent, updateSingleEvent );

module.exports = router;