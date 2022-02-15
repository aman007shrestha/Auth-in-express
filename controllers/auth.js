const User = require('../models/User');

exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({
      username,
      email,
      password,
    });
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
  // res.send('Register Route');
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: 'Please provide email and password' });
  }
  try {
    const user = await User.findOne({ email }).select('+password');
    // console.log(user);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Invalid credentials',
      });
    }
    // Compare password

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(404).json({
        success: false,
        error: 'Invalid Credentials',
      });
    }
    return res.status(200).json({
      success: true,
      user,
      token: 'huabsabj345',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
  // res.send('Login Route');
};

exports.forgotPassword = (req, res, next) => {
  res.send('Forgot password Route');
};

exports.resetPassword = (req, res, next) => {
  res.send(`Reset password Route ${req.params.resetToken}`);
};
