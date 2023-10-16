const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/sendToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const { upload_file, delete_file } = require('../utils/cloudinary');



//resister a user => /api/v1/register

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
    console.log('name', name);

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: 'v1663513669/cld-sample-5',
            url: 'https://res.cloudinary.com/dn0ciws2z/image/upload/v1663513669/cld-sample-5.jpg',
        },
    });

    const token = user.getJwtToken()


    sendToken(user, 200, res)

})

//Loginuser => /api/v1/login

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;


    //checks if email and password is entered by user 
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password'), 400)
    }


    //Finding user in database
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    //Checks if password is correct or not 
    const isPasswordMatched = await user.comparePassword(password);


    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    const token = user.getJwtToken();

    sendToken(user, 200, res)
})



//Upload avatar => /api/v1/me/upload_avatar
exports.uploadAvatar = catchAsyncErrors(async (req, res, next) => {
    const avatarResponse = await upload_file(req?.body?.avatar, "shopIt-avatars");

    //remove previous avatar
    if (!req?.user?.avatar?.url) {
        await delete_file(req?.user?.avatar?.public_id);
    }



    const user = await User.findByIdAndUpdate(req?.user?._id, {
        avatar: avatarResponse,
    });


    res.status(200).json({
        user,
    })
})



//Forgot password => /api/v1/password/forgot

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {


    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404));

    }



    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false })


    //create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`


    const message = `Your password reset token is as follows :\n\n${resetUrl}\n\nIf you have not requested this email, ignore it`
    try {

        await sendEmail({
            email: user.email,
            subject: 'ShopIT Password Recovery',
            message
        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500))
    }

})

//Reset password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    //Hash the url token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')


    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))

    }

    //set up new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res)


})
//Get currently loggedin user details =>  /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);


    res.status(200).json({
        success: true,
        user
    })
})


//Update/change password => /api/v1/password/update

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    //check previous user password

    const isMatched = await user.comparePassword(req.body.oldpassword)
    if (!isMatched) {
        return next(new ErrorHandler('Old password is incorrect', 400));

    }
    user.password = req.body.password;
    await user.save();
    sendToken(user, 200, res);


})


//update user profile => /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    //update avatar: TODO

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        runValidators: true,
        userFindAndModify: false
    })
    res.status(200).json({
        success: true,

    })

})



//Logout user => /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: 'Logged Out'

    })
})


//Admin Routes
//Get all users => /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

//Get user details  => /api/v1/admin/user/:id

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);


    if (!user) {
        return next(new ErrorHandler(`User not found with the id${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })

})

//Update user profile by admin => /api/v1/admin/update


exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        userFindAndModify: true
    })

    res.status(200).json({
        success: true
    })

})

//delete user details by admin => /api/v1/admin/delete/:id

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);



    if (!user) {
        return next(new ErrorHandler(`User not found with id ${req.params.id}`));
    }

    //remove avatar from clouidnary :TODO

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: 'User deleted'
    })
})

