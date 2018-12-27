import { resolve } from "url";
import { isBuffer } from "util";

var Datastore = require("nedb"),
  db = new Datastore({ autoload: true });

db = {};
db.users = new Datastore("data/users.db");
db.submissions = new Datastore("data/submissions.db");

db.users.loadDatabase();
db.submissions.loadDatabase();

function usernameChecking(username) {
  for (let i = 0; i < username.length; i++) {
    var c = username[i];
    if (
      !(
        ("0" <= c && c <= "9") ||
        ("a" <= c && c <= "z") ||
        ("A" <= c && c <= "Z") ||
        c == "_" ||
        c == "-"
      )
    )
      return false;
  }
  return true;
}

export async function newUser(username, pass) {
  return new Promise((resolve, reject) => {
    db.users.findOne({ username: username }, function(err, docs) {
      if (err) reject(err);
      else if (username.length > 32)reject("this username's length is too long");
      else if (pass.length > 32) reject("this password's length is too long");
      else if (usernameChecking(username) === false) reject("this username included invalid characters");
      else if (docs !== null) reject("this username has been taken");
      else
        db.users.insert([{ username: username, pass: pass }], function(
          err2,
          docs2
        ) {
          if (err2) reject(err2);
          else resolve("user created");
        });
    });
  });
}

export async function readUser(username) {
  return new Promise((resolve, reject) => {
    db.users.findOne({ username: username }, function(err, docs) {
      if (err) reject(err);
      else if (docs === null) reject("invalid username");
      else resolve(docs);
    });
  });
}

export async function readSubmission(sub_id) {
  return new Promise((resolve, reject) => {
    db.submissions.findOne({ _id: sub_id }, function(err, docs) {
      if (err) reject(err);
      else if (docs === null) reject("invalid ID");
      else resolve(docs);
    });
  });
}

export async function submitCode(source_code, username, problemID) {
  return new Promise((resolve, reject) => {
    db.users.findOne({ username: username }, function(err, docs) {
      if (err) reject(err);
      else if (docs === null) reject("this username doesn't exists");
      else
        db.submissions.insert(
          [
            {
              source_code: source_code,
              status: "pending",
              date: new Date(),
              username: username,
              problemID: problemID
            }
          ],
          function(err2, docs2) {
            if (err2) reject(err2);
            else resolve("submitted");
          }
        );
    });
  });
}

export async function updateSubmission(sub_id, new_verdict) {
  return new Promise((resolve, reject) => {
    db.submissions.update(
      { _id: sub_id },
      { $set: { status: new_verdict } },
      { multi: false },
      function(err, docs) {
        if (err) reject(err);
        else if (docs === 0) reject("nothing was submitted");
        else resolve("new verdict applied");
      }
    );
  });
}

export async function updateUser(username, old_pass, new_pass) {
  return new Promise((resolve, reject) => {
    db.users.update(
      { username: username, pass: old_pass },
      { $set: { pass: new_pass } },
      { multi: false },
      function(err, docs) {
        if (err) reject(err);
        else if (docs === 0) reject("wrong password or username");
        else resolve("password changed");
      }
    );
  });
}

/** 
 * npx babel-node data/themisdata.js
 * nodemon --exec npx babel-node .\data\themisdata.js
*/

