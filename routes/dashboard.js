const express = require('express');
const router = express.Router();
const {Notice} = require('.././models');


const renderDashboard = (req, res) => {
    res.render('dashboard/index');
}

router
    .route('/')
    .get( renderDashboard );

module.exports = router;
