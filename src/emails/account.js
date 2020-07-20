const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendWelcomeMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'imbenrabi@gmail.com',
        subject: 'Thank you for joining in',
        text:`Hi ${name}, let me know how you get along with the app.`,
        html: `<strong>Hi ${name}, let me know how you get along with the app.</strong>`
    })
}

const sendCancellationMail =  (email, name) => {
    sgMail.send({
        to: email,
        from: 'imbenrabi@gmail.com',
        subject: 'Sorry to see you go!',
        text:`Hi ${name}, you can reply with some helpful user feedback.`,
        html: `<strong>Hi ${name}, you can reply with some helpful user feedback.</strong>`
    })
} 

module.exports = {
    sendWelcomeMail,
    sendCancellationMail
}