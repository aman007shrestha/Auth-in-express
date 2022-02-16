const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({
      username,
      email,
      password,
    });
    // res.status(201).json({
    //   success: true,
    //   user,
    //   token: '23ah456',
    // });
    sendToken(user, 201, res);
  } catch (error) {
    // res.status(500).json({
    //   success: false,
    //   error: error.message,
    // });
    next(error);
  }
  // res.send('Register Route');
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse('please provide an email and password', 400));
    // return res
    //   .status(400)
    //   .json({ success: false, error: 'Please provide email and password' });
  }
  try {
    const user = await User.findOne({ email }).select('+password');
    // console.log(user);

    if (!user) {
      // return res.status(404).json({
      //   success: false,
      //   error: 'Invalid credentials',
      // });
      return next(new ErrorResponse('Invalid Credentials', 401));
    }
    // Compare password

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid Credentials', 401));
      // return res.status(404).json({
      //   success: false,
      //   error: 'Invalid Credentials',
      // });
    }
    // return res.status(200).json({
    //   success: true,
    //   user,
    //   token: 'huabsabj345',
    // });
    sendToken(user, 200, res);
  } catch (error) {
    next(error);
    // return res.status(500).json({
    //   success: false,
    //   error: error.message,
    // });
  }
  // res.send('Login Route');
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse('Email could not be sent', 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save();
    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;
    const message = `
    <h1>You have a requested a password reset </h1>
    <p>Please go to this link to reset yout password</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;
    try {
      await sendEmail({
        to: user.email,
        subject: `Password reset request`,
        text: message,
      });
      res.status(200).json({
        success: true,
        data: 'Email Sent',
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return next(new ErrorResponse("Email couldn't be sent", 500));
    }
  } catch (error) {
    next(error);
  }
  // res.send('Forgot password Route');
};

exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');
  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return next(new ErrorResponse('Invalid reset TOken', 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(201).json({
      success: true,
      data: 'Password Reset Success',
    });
  } catch (error) {
    next(error);
  }
  // res.send(`Reset password Route ${req.params.resetToken}`);
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};
