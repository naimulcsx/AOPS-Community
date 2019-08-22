const express = require('express');
const router = express.Router();

const createNewEvent = (req, res) => {
    res.send(req.body);
}

router
    .route('/')
    .post( createNewEvent );

module.exports = router;