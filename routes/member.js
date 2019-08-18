const express = require('express');
const router = express.Router();
const {User} = require('../models');

const handleSignup = async (req, res) => {
    let newUser = await User.create(req.body);
    res.json({
        status: 'Success',
        data: {
            user: newUser
        }
    });
}

router
    .route('/signup')
    .post( handleSignup )


module.exports = router;