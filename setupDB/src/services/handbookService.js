import { reject } from "lodash";
import db from "../models/index";
let createHandbookService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.title || !data.imageBase64 || !data.contentMarkdown) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        console.log("daat:", data);
        await db.Handbook.create({
          title: data.title,
          image: data.imageBase64,
          contentHTML: data.contentHTML,
          contentMarkdown: data.contentMarkdown,
          createdAt: new Date(),
          updateAt: new Date(),
        });
        resolve({
          errCode: 0,
          errMessage: "OK",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};
let getAllHandbookService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Handbook.findAll({});
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = Buffer.from(item.image, "base64").toString("binary");
          return item;
        });
      }
      resolve({
        errMessage: "Ok",
        errCode: 0,
        data,
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
let deleteHandbookService = (handbookId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let Handbook = await db.Handbook.findOne({
        where: { id: handbookId.id },
      });
      console.log(Handbook);
      if (!Handbook) {
        resolve({
          errCode: 2,
          errMessage: "The Handbook isn't exist",
        });
      } else {
        await db.Handbook.destroy({
          where: { id: handbookId.id },
        });
        resolve({ errCode: 0, message: "The Handbook is deleted" });
      }
    } catch (err) {
      reject(err);
    }
  });
};
let updateHandbookData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameters",
        });
      }
      console.log("data", data);
      let Handbook = await db.Handbook.findOne({
        where: { id: data.id },
        raw: false,
      });
      console.log(Handbook);
      if (Handbook) {
        await Handbook.update({
          title: data.title,
          contentHTML: data.contentHTML,
          contentMarkdown: data.contentMarkdown,
          image: data.avatar === "" ? data.image : data.avatar,
        });
        resolve({
          errCode: 0,
          errMessage: "Update the user success!",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "User not found ",
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};
let getDetailHandbookByIdService = (inputId) => {
  return new Promise(async (resolve, reject) => {
    console.log(inputId);
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.Handbook.findOne({
          where: {
            id: inputId,
          },
        });
        console.log(data);

        resolve({
          errMessage: "ok",
          errCode: 0,
          data,
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};
module.exports = {
  createHandbookService: createHandbookService,
  getAllHandbookService: getAllHandbookService,
  deleteHandbookService: deleteHandbookService,
  updateHandbookData: updateHandbookData,
  getDetailHandbookByIdService: getDetailHandbookByIdService,
};
