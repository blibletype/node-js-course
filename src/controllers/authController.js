const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const transporter = require('../utils/nodemailer');

exports.getSignIn = (req, res) => {
  res.render('auth/sign-in', {
    docTitle: 'Sign In',
    path: '/signin',
  });
};

exports.postSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.redirect('/');
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.redirect('/');
    req.session.user = user;
    req.session.save(() => {
      res.redirect('/products');
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postSignOut = async (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect('/');
  });
};

exports.getSignUp = async (req, res) => {
  res.render('auth/sign-up', {
    docTitle: 'Sign Up',
    path: '/signup',
    errorMessage: req.flash('error'),
  });
};

exports.postSignUp = async (req, res) => {
  try {
    const { email, password, passwordConfirmation } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      req.flash('error', 'This email already exist. Try to sign in');
      return res.redirect('/signup');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    });

    const mailOptions = {
      from: process.env.MAILER_USER,
      to: email,
      subject: `Welcome`,
      text: `Successfully signed up!`,
    };
    transporter.sendMail(mailOptions, (err) => {
      console.log(err);
    });

    res.redirect('/signin');
  } catch (err) {
    console.log(err);
  }
};

exports.getReset = async (req, res) => {
  res.render('auth/reset-password', {
    docTitle: 'Reset password',
    path: '/reset',
    errorMessage: req.flash('error'),
  });
};

exports.postReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      req.flash('error', 'No account with that email found');
      return res.redirect('/reset');
    }
    crypto.randomBytes(32, async (error, buffer) => {
      if (error) return console.error(error);
      const token = buffer.toString('hex');
      user.resetToken = token;
      user.resetTokenExpirationDate = Date.now() + 3600000;
      await user.save();
      res.redirect('/');
      transporter.sendMail({
        from: process.env.MAILER_USER,
        to: email,
        subject: 'Reseting password',
        text: `
          <p>Hello! You requested a password reset</p>
          <p>CLick this link below to set a new password</p>
          <a href="http://localhost:3000/reset/${token}">reset</a>
        `,
      });
    });
  } catch (err) {
    console.error(err);
  }
};

exports.getNewPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpirationDate: { $gt: Date.now() },
    });
    if (!user) {
      req.flash('error', 'Token has been expired');
      return res.redirect('/');
    }
    res.render('auth/new-password', {
      docTitle: 'New password',
      path: '/new-password',
      errorMessage: req.flash('error'),
      userId: user._id.toString(),
      resetToken: token,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.postNewPassword = async (req, res) => {
  try {
    const { password, userId, resetToken } = req.body;
    const user = await User.findOne({
      resetToken: resetToken,
      resetTokenExpirationDate: { $gt: Date.now() },
      _id: userId,
    });
    if (!user) {
      req.flash('error', 'Token has been expired');
      return res.redirect('/');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpirationDate = undefined;
    await user.save();
    res.redirect('/signin');
  } catch (error) {
    console.error(error);
  }
};
