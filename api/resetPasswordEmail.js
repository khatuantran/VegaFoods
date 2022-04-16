const nodemailer = require('nodemailer');

module.exports = (email, resetPasswordString, hostName) => {
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        // port: 587,
        // secure: false,
        host: hostName,
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
        subject: 'Reset your password',
        text: 'and easy to do anywhere, even with Node.js',
        html:`<h1>Thanks for register your acount with VegaFoods</h1>
        <p>Click here to reset your password<a href="${link}/auth/reset-password?email=${email}&resetPasswordString=${resetPasswordString}"> reset</a></p>`,
    }
    transporter
        .sendMail(message)
        .then(() => {console.log("email send")})
        .catch((err) => { console.log("loi cho nay",err)})
}