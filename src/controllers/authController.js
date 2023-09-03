const User = require('../models/user');

exports.getSignIn = (req, res) => {
  res.render('auth/sign-in', {
    docTitle: 'Sign In',
    path: '/signin',
    isAuth: req.session.user,
  });
};

exports.postSignIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.redirect('/');
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
