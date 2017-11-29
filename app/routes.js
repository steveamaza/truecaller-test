module.exports = function (app, tc, io) {
  // HOME PAGE ========
  app.get('/', (req, res) => {
    res.render('index.ejs', { message: '' }); // load the index.ejs file
  });

  // LOGIN SECTION =======================
  app.post('/login', (req, res) => {
    console.log(req.body);
    tc.call_truecaller(req.body.phone, (err, body) => {
      if (err) return console.log('err: ', err);
      const validRequest = JSON.parse(body);
      if (!validRequest.requestId) {
        console.log('body ', body);
        return res.render('index.ejs', {
          message:
            'Phone number is in the wrong format. Please use country code (without the +, then the rest of your number',
        });
      }
      return res.render('profile.ejs');
    });
  });

  // PROFILE SECTION =====================
  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.ejs', {
      user: req.user, // get the user out of session and pass to template
    });
  });

  //
  app.post('/auth/truecaller/callback', (req, res) => {
    console.log(req.headers);
    console.log(req.body);
    res.send('OK');

    io.on('connection', (socket) => {
      tc.get_profile(req.body.token, (err, body) => {
        if (err) {
          console.log(err);
          return socket.emit('error', { message: 'Error fetching profile, please retry' });
        }
        return socket.emit('profile', { data: JSON.parse(body) });
      });
    });
  });

  // LOGOUT ==============================
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
