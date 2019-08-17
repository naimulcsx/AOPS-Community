const mongoose = require('mongoose');

const AOPSSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    type: {
        type: String,
        required: true
    },
    tagline: {
        type: String,
        required: true
    },
    displayMessage: {
        type: String,
        required: true
    }, 
    aboutDesc: {
        type: String,
        required: true
    },
    contactEmail: {
        type: String,
        required: true
    },
    contactPhone: {
        type: String,
        required: true
    },
    address: {
        type: Object,
        require: true
    },
    numberOfNoticesOnHomepage: {
        type: Number,
        required: true
    },
    numberOfNoticesOnNoticeIndex: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('AOPS', AOPSSchema);