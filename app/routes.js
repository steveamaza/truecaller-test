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
  if (connected && connected.connected) {
    return connected.emit('profile', { data: JSON.parse(body) });
  }
};

module.exports = function (app, tc, server) {
  // HOME PAGE ========
  app.get('/', (req, res) => {
    res.render('index.ejs', { message: '' }); // load the index.ejs file
  });

  // LOGIN SECTION =======================
  app.post('/login', (req, res) => {
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
      data: {},
    });
  });

  //
  app.post('/auth/truecaller/callback', (req, res) => {
    console.log(req.body);
    res.send('OK');

    tc.get_profile(req.body.accessToken, (err, body) => {
      if (err) {
        return console.log('Something went wrong ', err);
      }
      console.log('we got a response ', body);
      const io = require('socket.io')(server);
      const connected = io.on('connection', (socket) => { socket.emit('message', 'something light')});
      return sendProfile(connected, body);
    });
  });
};
