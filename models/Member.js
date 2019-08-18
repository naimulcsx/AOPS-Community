const mongoose = require('mongoose');
const validator = require('validator');

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Name is required']
    },
    email: {
        type: String,
        require: [true, 'Email is required'],
        validate: [validator.isEmail, 'Email is not valid.']
    },
    photo: {
        type: String,
        default: '/img/uploads/avatar.jpg'
    },
    created: {
        type: Date,
        default: Date.now()
    },
    password: {
        type: String,
        require: [true, 'Password is required'],
        validate: {
            validator: function( val ) {
                return val.length >= 8;
            },
            message: 'A valid password contains at least 8 charecters.'
        }
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Confirm password is required'],
        validate: {
            validator: function( val ) {
                return val === this.password;
            },
            message: 'Passwords are not the same.'
        }
    }
});

// userSchema.path('email').validate(async (value) => {
//     const emailCount = await mongoose.models.userSchema.countDocuments({email: value });
//     return !emailCount;
// }, 'Email already exists');


module.exports = mongoose.model('Member ', memberSchema);