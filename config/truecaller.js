// load the auth variables
const configAuth = require('./auth');

const request = require('request');

// Set the headers
const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache',
  appKey: configAuth.truecallerAuth.appKey,
};

// Configure the request
const getOptions = (data, method, reqheaders, url) => ({
  url,
  method,
  headers: reqheaders,
  body: JSON.stringify(data),
});

// Start the request
module.exports = {
  call_truecaller: (phoneNumber, callback) => {
    const options = getOptions(
      { phoneNumber },
      'POST',
      headers,
      'https://api4.truecaller.com/v1/apps/requests',
    );
    request(options, (error, response, body) => {
      if (error) return callback(error, null);
      return callback(null, body);
    });
  },
  get_profile: (token, callback) => {
    const reqheaders = {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
    };
    const options = getOptions({}, 'GET', reqheaders, 'https://profile4.truecaller.com/v1/default');
    request(options, (err, response, body) => {
      if (err) return callback(err, null);
      return callback(null, body);
    });
  },
};
