const mailer = require('@sendgrid/mail');

var apiKey = process.env.SENDGRID_API_KEY;
mailer.setApiKey(apiKey);

function sendMail(data) {
    const mail = {
        to: data.sender,
        from: data.receiver,
        subject: data.subject,
        text: data.text,
        html: data.html
    }
    mailer.send(mail,(error, result) => {
        if (error) {
            console.log(error);
        } else {
            console.log("That's wassup!");
        }
    });
}
exports.sendMail = sendMail;