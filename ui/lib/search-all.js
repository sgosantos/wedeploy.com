// Dependencies
var pages = require('./pages-all');
var request = require('request');

// Validate --------------------------------------------------------------------

if (!process.env.SECRET_TOKEN) {
    throw new Error('Please setup environment vars');
}

// Run -------------------------------------------------------------------------

pages.read(function(json) {
	deleteAll(json);
});

// Delete ----------------------------------------------------------------------

function deleteAll(json) {
    request({
        url: 'http://docs.wedeploy.com/search?secretToken=' + process.env.SECRET_TOKEN,
        method: 'DELETE'
    }, function (error, response, body) {
        if (!error) {
            saveAll(json);
        }
    });
}

// Save ------------------------------------------------------------------------

function saveAll(json) {
    request({
        url: 'http://docs.wedeploy.com/search?secretToken=' + process.env.SECRET_TOKEN,
        method: 'POST',
        json: json
    }, function (error, response, body) {
        if (!error) {
            console.log('Done!');
        }
    });
}
