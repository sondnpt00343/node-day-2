const { verifyEmailSecret } = require("../config/jwt");
const transporter = require("../config/nodemailer");
const jwtUtils = require("../utils/jwt");

class EmailService {
    async sendVerifyEmail(user) {
        const token = jwtUtils.sign(
            { sub: user.id, exp: Date.now() + 60 * 60 * 24 * 1000 },
            verifyEmailSecret
        );
        const info = await transporter.sendMail({
            from: '"F8" <sondang@fullstack.edu.vn>',
            to: user.email,
            subject: "Xac thuc tai khoan",
            html: `<p><a href="http://localhost:5173?token=${token}">Click here</a>!</p>`,
        });
        return info;
    }
}

module.exports = new EmailService();
