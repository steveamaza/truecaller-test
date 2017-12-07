// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }
  // if they aren't redirect them to the home page
  return res.redirect('/');
}

const sendProfile = (connected, body) => {
  console.log(connected.emit);
  if (connected && connected.connected) {
    console.log('We got to send Profile');
    connected.emit('profile', body);
  }
};

module.exports = (app, tc, connected) => {
  // HOME PAGE ========
  app.get('/', (req, res) => {
    res.render('index.ejs', { message: '' }); // load the index.ejs file
  });

  // LOGIN SECTION =======================
  app.post('/login', (req, res) => {
    tc.call_truecaller(req.body.phone, (err, body) => {
      if (err) return console.log('err: ', err);
      const validRequest = JSON.parse(body);
      console.log(validRequest);
      if (!validRequest.requestId) {
        console.log('body ', body);
        return res.render('index.ejs', {
          message:
            'Phone number is in the wrong format. Please use country code (without the +, then the rest of your number',
        });
      }
      return res.render('profile.ejs', { requestId: validRequest.requestId });
    });
  });

  // PROFILE SECTION =====================
  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.ejs');
  });

  //
  app.post('/auth/truecaller/callback', (req, res) => {
    console.log(req.body);
    res.send('OK');

    return sendProfile(connected, req.body);
  });
};
