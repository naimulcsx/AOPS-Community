const mongoose = require('mongoose');
const gallerySchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Album name is required']
    },
    images: {
        type: [String],
        validate: {
            validator: function(imagesArr) {
                return imagesArr.length >= 1;
            },
            message: 'You must include at least 1 photo'
        }
    },
    created: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    },
    shortDesc: {
        type: String,
        default: null
    }
});


module.exports = mongoose.model('Gallery', gallerySchema, 'galleries');