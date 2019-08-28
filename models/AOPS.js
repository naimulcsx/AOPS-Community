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
    social: {
        type: Object,
        default: {
            facebook: 'https://www.facebook.com',
            twitter: 'https://twitter.com'
        }
    },
    numberOfNoticesOnHomepage: {
        type: Number,
        required: true
    },
    numberOfNoticesOnNoticeIndex: {
        type: Number,
        required: true
    },
    numberOfAchievementsOnHomepage: {
        type: Number,
        required: true
    },
    numberOfAchievementsOnAchievementPage: {
        type: Number,
        require: true
    },
    numberOfGalleryOnHomepage: {
        type: Number,
        required: true
    },
    numberOfGalleryOnGalleryPage: {
        type: Number,
        required: true
    },
    numberOfEventsOnHomepage: {
        type: Number,
        required: true
    },
    numberOfEventsOnEventsPage: {
        type: Number,
        required: true
    },
    logo: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('AOPS', AOPSSchema);