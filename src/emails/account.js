const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);




const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'andrew.persaud13@gmail.com',
        subject: 'Welcome to Bear Cave.',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
};

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'andrew.persaud13@gmail.com',
        subject: 'Good bye from the Bear Cave.',
        text: `Thank you for your time spent on the app. You are always welcome to come back ${name} :)`
    })
};

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}