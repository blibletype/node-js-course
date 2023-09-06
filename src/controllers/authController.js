const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const transporter = require('../utils/nodemailer');

exports.getSignIn = (req, res, next) => {
  res.render('auth/sign-in', {
    docTitle: 'Sign In',
    path: '/signin',
    errorMessage: req.flash('error'),
    successMessage: req.flash('success'),
  });
};

exports.postSignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req).array() || [];
    const user = await User.findOne({ email: email });
    const passwordMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;
    if (!user || !passwordMatch) {
      errors.push({ path: 'email' });
    }
    if (errors.length > 0) {
      return res.status(422).render('auth/sign-in', {
        docTitle: 'Sign In',
        path: '/signin',
        errors: errors,
        oldInputs: { email: email },
      });
    }
    req.session.user = user;
    req.session.save(() => {
      res.redirect('/products');
    });
  } catch (error) {
    return next(error);
  }
};

exports.postSignOut = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect('/');
  });
};

exports.getSignUp = async (req, res, next) => {
  res.render('auth/sign-up', {
    docTitle: 'Sign Up',
    path: '/signup',
    errorMessage: req.flash('error'),
  });
};

exports.postSignUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req).array() || [];
    const user = await User.findOne({ email: email });
    if (user) {
      errors.push({ path: 'email' });
    }
    if (errors.length > 0) {
      return res.status(422).render('auth/sign-up', {
        docTitle: 'Sign Up',
        path: '/signup',
        errors: errors,
        oldInputs: { email: email, password: password },
      });
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
  } catch (error) {
    return next(error);
  }
};

exports.getReset = async (req, res, next) => {
  res.render('auth/reset-password', {
    docTitle: 'Reset password',
    path: '/reset',
  });
};

exports.postReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const errors = validationResult(req).array() || [];
    const user = await User.findOne({ email: email });
    if (!user) {
      errors.push({ path: 'email' });
    }
    if (errors.length > 0) {
      return res.status(422).render('auth/reset-password', {
        docTitle: 'Reset password',
        path: '/reset',
        errors: errors,
        oldInputs: { email: email },
      });
    }

    crypto.randomBytes(32, async (error, buffer) => {
      if (error) return console.error(error);
      const token = buffer.toString('hex');
      user.resetToken = token;
      user.resetTokenExpirationDate = Date.now() + 3600000;
      await user.save();
      req.flash(
        'success',
        'Success! We will send email with link to reset your password'
      );
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
  } catch (error) {
    return next(error);
  }
};

exports.getNewPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpirationDate: { $gt: Date.now() },
    });
    if (!user) {
      req.flash('error', 'Token has been expired');
      return res.redirect('/signin');
    }
    res.render('auth/new-password', {
      docTitle: 'New password',
      path: '/new-password',
      userId: user._id.toString(),
      resetToken: token,
    });
  } catch (error) {
    return next(error);
  }
};

exports.postNewPassword = async (req, res, next) => {
  try {
    const { password, userId, resetToken } = req.body;
    const user = await User.findOne({
      _id: userId,
      resetToken: resetToken,
      resetTokenExpirationDate: { $gt: Date.now() },
    });
    if (!user) {
      req.flash('error', 'Your token has been expired');
      return res.redirect('/signin');
    }
    const errors = validationResult(req).array() || [];
    if (errors.length > 0) {
      return res.status(422).render('auth/new-password', {
        docTitle: 'New password',
        path: '/new-password',
        errors: errors,
        oldInputs: { password: password },
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpirationDate = undefined;
    await user.save();
    req.flash('success', 'You successfully changed the password');
    res.redirect('/signin');
  } catch (error) {
    return next(error);
  }
};
