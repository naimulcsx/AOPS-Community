const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Event name is required']
    },
    type: {
        type: String,
        required: [true, 'Event type is required']
    }
});
