/**
 * Mail service controller
 *
 * User: Etienne Dodat
 * Date: 21/10/13
 */

////////////////////
// INITIALIZATION //
////////////////////

var nodemailer = require('nodemailer'),
    config = require('../config/mail.js');

/////////////
// PRIVATE //
/////////////

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP", config.transportOptions);

function send(recipient, subject, text, HTML, callback){
    var mailOptions = {
        from: config.FROM, // sender address
        to: recipient, // list of receivers
        subject: subject, // Subject line
        text: text, // plaintext body
        html: HTML // html body
    }
    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log('[MAIL] Message to', recipient, 'resulted in error:', error);
        }else{
            console.log('[MAIL] Message sent to', recipient, ':', response.message);
        }
        if (callback) callback(error, response);
    });
}

////////////
// PUBLIC //
////////////

module.exports.sendActivation = function(recipient, activationLink, callback){
    var subject = 'Activate your '+config.PRODUCT+' instance';
    var text = 'Hello,\n' +
        'Thank you for registering to '+config.PRODUCT+'!\n' +
        'Please copy the link below in your internet browser to activate your private instance:\n' +
        activationLink+'\n' +
        '\n' +
        'If you encounter any issues during the activation process, please contact our Support team at '+config.SUPPORT+'.\n' +
        '\n' +
        'Regards,\n' +
        'The '+config.PRODUCT+' team';
    var HTML = 'Hello,<br>' +
        'Thank you for registering to '+config.PRODUCT+'!<br>' +
        'Please click on the link below (or copy it in your internet browser) to activate your private instance:<br>' +
        '<a href="'+activationLink+'">'+activationLink+'</a><br>' +
        '<br>' +
        'If you encounter any issues during the activation process, please contact our Support team at '+config.SUPPORT+'.<br>' +
        '<br>' +
        'Regards,<br>' +
        'The '+config.PRODUCT+' team';

    send(recipient, subject, text, HTML, callback);
};