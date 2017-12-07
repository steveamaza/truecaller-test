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
    const { accessToken } = req.body;
    console.log('ACCESS TOKEN', accessToken);
    tc.get_profile(accessToken, (err, body) => {
      if (err) return console.log('err: ', err);
      const profileData = JSON.parse(body);
      console.log(profileData);
      return res.render('profile.ejs', { profile: profileData });
    });
  });
};
