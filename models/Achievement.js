const mongoose = require('mongoose');

const achievementSchema  = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Achievement title is required']
    },
    desc: {
        type: String,
        required: [true, 'Achievement title is required']
    },
    created: {
        type: Date,
        default: Date.now
    },
    cover: {
        type: String,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    }
});

module.exports = mongoose.model('Achievement', achievementSchema);