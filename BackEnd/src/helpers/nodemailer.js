import nodemailer from 'nodemailer';
import fs from 'fs';

function sendEmail(newPassword, userEmail) {
    const transporter = nodemailer.createTransport({
        service: process.env.SERVICO,
        auth: {
            user: process.env.USUARIO,
            pass: process.env.PASSWORD
        }
    });

    let mailOptions = {
        from: process.env.USUARIO,
        to: userEmail,
        subject: "Recuperação de senha.",
        html: getEmailTemplate(newPassword)
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log("Erro ao enviar e-mail:", err);
        } else {
            console.log("E-mail enviado: " + info.response);
        }
    });
}

const getEmailTemplate = (newPassword) => {
    const today = new Date();
    const year = today.getFullYear();  // Corrigido de 'yaer' para 'year'
    let htmlTemplate = fs.readFileSync("./src/template/senha.html", "utf-8");
    
    // Substitui os placeholders e atribui de volta à variável
    htmlTemplate = htmlTemplate.replaceAll('{{newPassword}}', newPassword);
    htmlTemplate = htmlTemplate.replaceAll('{{year}}', year); 
    
    return htmlTemplate;
};

export { sendEmail };
