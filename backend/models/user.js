const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [30, 'Your name cannot exceed 30 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minLength: [6, 'Your password must be longer than 6 characters'],
        // select : false does not allow the the password field to be returned in a query
        // for protecting the password
        select: false,
    },

    // avatar is the users image
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    role: {
        type: String,
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    //resetPasswordToken is the token we will send to the user if he forgets password and sends request
    //for the new password . to recover the password it will send email to the user with the token
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre('save', async function (next) {
    console.log('pre save user');
    if (!this.isModified('password')) {
        next;
    }
    console.log('pre save user 2');
    // 10 is the salt value . It asynchronously generates a hash for the given string
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

//compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}


//Return JWT token

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}



//Generate password reset token

userSchema.methods.getResetPasswordToken = function () {
    //generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //hash and set to reset password token


    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    //set token expire time 

    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000
    return resetToken
}


module.exports = mongoose.model('User', userSchema);