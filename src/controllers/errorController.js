exports.getPageNotFound = (req, res, next) => {
  res.status(404).render('404', { docTitle: 'Page Not Found' });
};

exports.getInternalServerError = (error, req, res, next) => {
  console.log(error);
  res.status(500).render('500', { docTitle: 'Internal Server Error' });
};
