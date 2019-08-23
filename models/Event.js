const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Event name is required']
    },
    type: {
        type: String,
        required: [true, 'Event type is required']
    },
    desc: {
        type: String,
        deafult: null
    },
    fee: {
        type: String,
        default: 0
    },
    startTime: {
        type: Date,
        required: [true, 'Event\'s beginning time is required.']
    },
    finishTime: {
        type: Date,
        required: [true, 'Event\'s ending time is required.']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    },
    created: {
        type: Date,
        default: Date.now
    },
    galleryId: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Event', eventSchema);