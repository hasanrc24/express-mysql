const nodemailer = require("nodemailer");
const resetEmail = require("../emails/resetEmail");
const verificationEmail = require("../emails/verificationEmail");

module.exports = class Email{
    constructor(user, baseUrl, code){
        this.user = user
        this.firstName = user.firstName
        this.lastName = user.lastName
        this.to = user.email
        this.from = "Md Hasan <hasan@test.io>"
        this.baseUrl = baseUrl
        this.code = code
    }

    newTransport(){
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
    }

    async send(template, subject){

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html: template(this.user, this.baseUrl, this.code),
            text: template(this.user, this.baseUrl, this.code)
        }

        await this.newTransport().sendMail(mailOptions)
    }

    async sendResetEmail(){
        await this.send(resetEmail, 'Reset your password')
    }

    async sendVerificationEmail(){
        await this.send(verificationEmail, 'Verify your account.')
    }
}

