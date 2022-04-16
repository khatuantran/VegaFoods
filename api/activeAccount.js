const nodemailer = require('nodemailer');

module.exports = (email, activationString, hostName) => {
    const transporter = nodemailer.createTransport({
        host: hostName,
        port: process.env.PORT || 3000,
        auth: {
            user: "vegafoods@outlook.com",
            pass: process.env.EMAIL_SENDER_PASS
        }
    })

    let link;
    if(process.env.PORT){
        link = 'https://' + hostName
    } else link = 'http://' + hostName + ':' + 3000

    const message = {
        from: '"VegaFoods"<vegafoods@outlook.com>',
        to: email,
        subject: 'Activation your acount now!',
        text: 'and easy to do anywhere, even with Node.js',
        html:`<h1>Thanks for register your acount with VegaFoods</h1>
        <p>Click here to activate<a href="${link}/user/activate?email=${email}&activationString=${activationString}"> Active now</a></p>`,
    }
    transporter
        .sendMail(message)
        .then(() => {console.log("email send")})
        .catch((err) => { console.log(err)})
}