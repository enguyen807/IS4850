const nodemailer = require('../node_modules/nodemailer');
const APP_NAME = 'Cloud Storage for Firebase quickstart';
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'blueoceanrestaurantmanager@gmail.com',
        pass: '1Seafood.'
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
    to: 'enguyen807@gmail.com', // list of receivers
    subject: 'Reservation Confirmation', // Subject line
    text: 'Hello world ?', // plain text body
    html: '<b>Hello world ?</b>' // html body
};

// send mail with defined transport object

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});