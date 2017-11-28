module.exports = function (app, tc) {
  // =====================================
  // HOME PAGE ========
  // =====================================
  app.get('/', (req, res) => {
    res.render('index.ejs'); // load the index.ejs file
  });

  // process the login form
  app.post('/login', (req, res) => {
    tc.call_truecaller(req.body.phone, (err, body) => {
      if(err)
        return console.log('err: ', err);
      console.log('body ', body);
      res.send("ok");
    });
  });

  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.ejs', {
      user: req.user, // get the user out of session and pass to template
    });
  });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }
  // if they aren't redirect them to the home page
  return res.redirect('/');
}
