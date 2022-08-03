const sgMail = require("@sendgrid/mail")
console

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "johnnyetsha@gmail.com",
        subject: "Merci de nous avoir rejoins",
        text: `Bienvenue dans l'application ${name}.`,
    })
}


const sendByeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "johnnyetsha@gmail.com",
        subject: `Suppression compte `,
        text: `Merci d'avoir utiliser nos services ${name}`
    })
}
module.exports = {
    sendWelcomeEmail, sendByeEmail
}