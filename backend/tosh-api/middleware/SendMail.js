const nodemailer = require('nodemailer');
require('dotenv').config();
const hbs = require('nodemailer-express-handlebars');
const path = require('path');


const handlebarOptions = {
    viewEngine: {
        extName: '.handlebars',
        partialsDir: path.resolve(__dirname, "..", 'views'),
        defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, "..", 'views'),
    extName: '.handlebars'
}

const transporter = nodemailer.createTransport({
    host : process.env.SMTP_HOST,
    port : 465,
    secure : true,
    auth : {
        user : process.env.SMTP_EMAIL,
        pass : process.env.SMTP_PASSWORD
    }
});

transporter.verify(function (error, response) {
   if (error) {
       console.error('Error in sending mail:', error);
   } else {
       console.log('Server is ready to take messages');
   }
});

transporter.use('compile', hbs(handlebarOptions));

function generateRandomItems(length){
    let items = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        items += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return items;
}

const constructMail = (to, subject, image, name, body, showButton = false, verificationLink = '') => {
    const url = process.env.IMAGE_ASSETS;
    return {
        from: process.env.SMTP_EMAIL,
        to: to,
        subject: `${subject} - ${generateRandomItems(10)}`,
        template: 'mail',
        context: {
            subjectTitle: subject,
            image: url + image,
            name: name,
            body: body,
            showButton: showButton,
            verificationLink: verificationLink,
            srcimg: `${url}server-assets/spareswhite.png`
        }
    }
}

const sendMail = async (to, subject, image, name, body, showButton=false, verificationLink = '') => {
    try {
    const mailOptions = constructMail(to, subject, image, name, body, showButton, verificationLink);
    return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error in Sending Mail:', error);
        return error;
    }
}


module.exports = { sendMail };