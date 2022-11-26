import { reject } from "lodash";
import nodemailer from "nodemailer";
require("dotenv").config();

let sendSimpleEmail = async (dataSend) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"COMPREHENSIVE HEALTH CARE " <quachthingoctrang10gmail.com>', // sender address
    to: dataSend.reciverEmail, // list of receivers
    subject: "THÔNG TIN ĐẶT LỊCH KHÁM BỆNH", // Subject line
    html: getBodyHTMLEmailRemedy(dataSend),
  });
};
let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `<h3>Xin chào ${dataSend.patientName}!</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên COMPREHENSIVE HEALTH CARE
    <p>Thông tin đặt lịch khám bệnh:</p>
    <div><b>Thời gian: ${dataSend.time}</b></div>
    <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
    <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên được
    để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.
    </p>
    <div>
    <a href=${dataSend.redirectLink} target="_blank" >Click here</a>
    </div>
    <div> Xin chân thành cảm ơn </div>

    `; // html body noi dung email
  }
  if (dataSend.language === "en") {
    result = `<h3>Dear ${dataSend.patientName}!</h3>
    <p>You received this email because you made an online appointment with Comprehensive Health Care.
    <p>Information to schedule an appointment:</p>
    <div><b>Time: ${dataSend.time}</b></div>
    <div><b>Doctor: ${dataSend.doctorName}</b></div>
    <p>If the above information is correct, please click on the link below
    to confirm and complete the appointment booking process.
    </p>
    <div>
    <a href=${dataSend.redirectLink} target="_blank" >Click here</a>
    </div>
    <div> Sincerely thank! </div>

    `; // html body noi dung email
  }
  return result;
};
let sendAttachment = async (dataSend) => {
  return new Promise(async (resolve, reject) => {
    try {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });
      let info = await transporter.sendMail({
        from: 'Mail từ COMPREHENSIVE HEALTH CARE "<quachthingoctrang10gmail.com>',
        to: dataSend.email,
        subject: "Kết quả đặt lịch khám bệnh",
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [
          {
            filename: `remedy-${
              dataSend.patientId
            }-${new Date().getTime()}.png`,
            content: dataSend.imgBase64.split("base64,")[1],
            encoding: "base64",
          },
        ],
      });
      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
};
module.exports = {
  sendSimpleEmail: sendSimpleEmail,
  sendAttachment: sendAttachment,
};
