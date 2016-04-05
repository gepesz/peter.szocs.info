// mailer.js

'use strict';

// require module dependencies
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var moment = require('moment');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var dotenv = require('dotenv');

// load environment variables from .env file
dotenv.load();

// create transport
var transport = nodemailer.createTransport(sgTransport({
    auth: {
        api_user: process.env.SENDGRID_USER,
        api_key: process.env.SENDGRID_PASS
    }
}));

// create template file link
var templateFile = path.join(__dirname, './template.html');

// send text & html email to recipient specified in the 'from' parameter
function sendMail(name, from, phone, message) {
    return new Promise(function(resolve, reject) {
        fs.readFile(templateFile, 'utf8', function (err, data) {
            // check for file read success
            if (err) {
                // failure
                console.log(err);
                reject(err);
            } else {
                // success
                
                // format date
                var now = new Date();
                var formattedDate = moment(now).format('MMMM D, YYYY');
                
                // replace placeholders
                data = data.replace(/__DATE__/g, formattedDate);
                data = data.replace(/__NAME__/g, name);
                data = data.replace(/__EMAIL__/g, from);
                data = data.replace(/__PHONE__/g, phone);
                data = data.replace(/__MESSAGE__/g, message);

                // prepare email
                var email = {
                    to: process.env.EMAIL_TO_URL,
                    from: from,
                    subject: process.env.EMAIL_SUBJECT_TEXT,
                    text: message,
                    html: data
                };
                
                // send email
                transport.sendMail(email, function(err, res) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        // console.log(res);
                        resolve({ success: true });
                    }
                });
            }
        });
    });
}

module.exports = {
    sendMail: sendMail
};