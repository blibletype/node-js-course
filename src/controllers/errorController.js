exports.pageNotFound = (req, res) => {
  res.status(404).render('page-not-found', { docTitle: 'Page Not Found' });
};
