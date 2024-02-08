"use strict";

const fs = require("fs");

export async function writeJsonFile(filepath) {
  fs.writeFile(filepath, "io", (err) => {
    if (err) {
      throw err;
    }
    else {
      console.log("success");
    }
  });
}

export async function readJsonFile(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, "utf-8", (err, data) => {
      console.log(data);
      resolve(data);
    });
  });
}
