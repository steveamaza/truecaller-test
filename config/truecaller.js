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

// Start the request
module.exports = {
  call_truecaller: (phoneNumber, callback) => {
    const options = {
      url: 'https://api4.truecaller.com/v1/apps/requests',
      method: 'POST',
      headers,
      body: JSON.stringify({ phoneNumber }),
    };
    request(options, (error, response, body) => {
      if (error) return callback(error, null);
      return callback(null, body);
    });
  },
};
