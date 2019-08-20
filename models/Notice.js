const mongoose = require('mongoose');

const noticeSchema  = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    }
});

module.exports = mongoose.model('Notice', noticeSchema);