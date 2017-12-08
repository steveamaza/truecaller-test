const User = require('./models/user');

module.exports = (app, tc) => {
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
      return res.render('profile.ejs', { requestId: validRequest.requestId, profile: 'yes' });
    });
  });

  // PROFILE SECTION =====================
  app.get('/profile', (req, res) => {
    res.render('profile.ejs');
  });

  //
  app.post('/auth/truecaller/callback', (req, res) => {
    res.send('ok');
    const { accessToken } = req.body;
    console.log('ACCESS TOKEN', accessToken);
    tc.get_profile(accessToken, (err, body) => {
      if (err) return console.log('err: ', err);
      const profileData = JSON.parse(body);

      const newUser = new User({
        name: profileData.name,
        phone: profileData.phoneNumbers,
        profile: profileData.onlineId,
      });
      newUser.save((error) => {
        // will this callback always be called correctly?
        if (error) {
          res.send('ERROR!');
        } else {
          res.send('SUCCESS!');
        }
      });

      console.log(body);
      res.send('Profile Saved');
    });
  });

  // app.get('/profiledata/:phone', (req, res) => {
  //   let phone = req.params.phone;

  // });
};
