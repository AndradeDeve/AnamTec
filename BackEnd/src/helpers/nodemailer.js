import nodemailer from 'nodemailer';
import fs from 'fs';


function sendEmail(newPassword, userEmail){
    const transporter = nodemailer.createTransport({
        service: process.env.servico,
        auth: {
            user: process.env.usuario,
            pass: process.env.passWord
        }
    });

    let mailOptions = {
        from: process.env.usuario,
        to: userEmail,
        subject: "Recuperação de senha.",
        html: getEmailTemplate(newPassword)
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            console.log("Erro ao enviar e-mail:", err);
        }else{
            console.log("E-mail enviado" + info.response);
        }
    });
}

const getEmailTemplate = (newPassword) => {
    const htmlTemplate = fs.readFileSync("./src/template/senha.html", "utf-8");
    return htmlTemplate.replace('{{newPassword}}',  newPassword);
};

export {sendEmail};