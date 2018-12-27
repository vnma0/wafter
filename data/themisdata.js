import { resolve } from "url";
import { isBuffer } from "util";

var Datastore = require("nedb"),
  db = new Datastore({ autoload: true });
//db.persistence.setAutocompactionInterval(5001);

db = {};
db.users = new Datastore("data/users.db");
db.submissions = new Datastore("data/submissions.db");

db.users.loadDatabase();
db.submissions.loadDatabase();

/*
    code{
        _id: (hidden)
        problemID:
        username:
        source_code:
        date:
        status:
        // verdict on testcase ?
    }
    user{
        _id: (hidden)
        username:
        pass:
    }
*/

// checking if an username is valid
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

// adding new user
export async function newUser(username, pass) {
  return new Promise((resolve, reject) => {
    db.users.findOne({ username: username }, function(err, docs) {
      if (err) reject(err);
      // making sure that the lengths meet the requirements
      else if (username.length > 32)
        reject("this username's length is too long");
      // making sure that the lengths meet the requirements
      else if (pass.length > 32) reject("this password's length is too long");
      // making sure there isn't any invalid character
      else if (usernameChecking(username) === false)
        reject("this username included invalid characters");
      // making sure the username hasn't been taken
      else if (docs !== null) reject("this username has been taken");
      // creating new user
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

// get user's properties
export async function readUser(username) {
  return new Promise((resolve, reject) => {
    db.users.findOne({ username: username }, function(err, docs) {
      if (err) reject(err);
      // making sure that the username is valid
      else if (docs === null) reject("invalid username");
      // return user's properties
      else resolve(docs);
    });
  });
}

// reading the submission's properties by id
export async function readSubmission(sub_id) {
  return new Promise((resolve, reject) => {
    db.submissions.findOne({ _id: sub_id }, function(err, docs) {
      if (err) reject(err);
      // making sure that the id is valid
      else if (docs === null) reject("invalid ID");
      // return the submission's properties
      else resolve(docs);
    });
  });
}

// submitting the code
export async function submitCode(source_code, username, problemID) {
  return new Promise((resolve, reject) => {
    db.users.findOne({ username: username }, function(err, docs) {
      if (err) reject(err);
      // making sure the username is valid
      else if (docs === null) reject("this username doesn't exists");
      // submitting the code
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

// export async function testCode(username) {
//   return new Promise((resolve, reject) => {
//     db.submissions.find({ username: username }, function(err, docs) {
//       console.log(docs.length);
//     });
//   });
// }

// testCode("user1");
/*
    npx babel-node data/themisdata.js
    nodemon --exec npx babel-node .\data\themisdata.js
*/
