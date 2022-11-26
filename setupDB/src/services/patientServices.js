import db from "../models/index";
require("dotenv").config();
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";

let buildUrlEmail = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return result;
};
let postVerifyBookAppointmentService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: "S1",
          },
          raw: false,
        });

        if (appointment) {
          appointment.statusId = "S2";
          await appointment.save();
          resolve({
            errCode: 0,
            errMessage: "Update the appointment successed",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Appointment has been activated or does not exits",
          });
        }
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};
let postBookAppointmentService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(data);
      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType ||
        !data.date ||
        !data.fullName
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let token = uuidv4();
        await emailService.sendSimpleEmail({
          reciverEmail: data.email,
          patientName: data.fullName,
          time: data.timeString,
          doctorName: data.doctorName,
          redirectLink: buildUrlEmail(data.doctorId, token),
        });

        let user = await db.User.findOrCreate({
          where: {
            email: data.email,
          },
          defaults: {
            email: data.email,
            roleId: "R3",
            gender: data.selectedGender,
            firstName: data.fullName,
            phoneNumber: data.phoneNumber,
            address: data.address,
          },
        });
        console.log("user", user[0]);
        console.log(data);
        if (user && user[0]) {
          console.log("time String", data.timeString);
          await db.Booking.findOrCreate({
            where: { patientId: user[0].id },
            defaults: {
              statusId: "S1",
              doctorId: parseInt(data.doctorId),
              patientId: parseInt(user[0].id),
              date: data.date,
              timeType: data.timeType,
              token: token,
            },
          });
        }
        resolve({
          errCode: 0,
          errMessage: "Save infor patient successed ",
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

module.exports = {
  postBookAppointmentService: postBookAppointmentService,
  postVerifyBookAppointmentService: postVerifyBookAppointmentService,
};
