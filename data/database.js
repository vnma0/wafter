var Datastore = require("nedb"),
    db = new Datastore({ autoload: true });

import bcrypt from "bcrypt-nodejs";

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

export function newUser(username, pass) {
    return new Promise((resolve, reject) => {
        db.users.findOne({ username: username }, function(err, docs) {
            if (err) reject(err);
            else if (username.length > 32)
                reject("this username's length is too long");
            else if (pass.length > 32)
                reject("this password's length is too long");
            else if (usernameChecking(username) === false)
                reject("this username included invalid characters");
            else if (docs) {
                reject("this username has been taken");
                return;
            } else
                db.users.insert(
                    [{ username: username, pass: bcrypt.hashSync(pass) }],
                    function(err2, docs2) {
                        if (err2) reject(err2);
                        else resolve("user created");
                    }
                );
        });
    });
}

export function readAllUser() {
    return new Promise((resolve, reject) => {
        db.users.find({}, function(err, docs) {
            if (err) reject(err);
            else resolve(docs);
        });
    });
}

export function readUser(username) {
    return new Promise((resolve, reject) => {
        db.users.findOne({ username: username }, function(err, docs) {
            if (err) reject(err);
            else if (docs === null) reject("invalid username");
            else resolve(docs);
        });
    });
}

export function readUserByID(id) {
    return new Promise((resolve, reject) => {
        db.users.findOne({ _id: id }, function(err, docs) {
            if (err) reject(err);
            else if (docs === null) reject("invalid user_id");
            else resolve(docs);
        });
    });
}

export function readAllSubmission(sub_id) {
    return new Promise((resolve, reject) => {
        db.submissions.find({}, function(err, docs) {
            if (err) reject(err);
            else resolve(docs);
        });
    });
}

export function readSubmission(sub_id) {
    return new Promise((resolve, reject) => {
        db.submissions.findOne({ _id: sub_id }, function(err, docs) {
            if (err) reject(err);
            else if (docs === null) reject("invalid ID");
            else resolve(docs);
        });
    });
}

export function readUserSubmission(user_id) {
    return new Promise((resolve, reject) => {
        db.submissions.find({ user_id }, function(err, docs) {
            if (err) reject(err);
            else if (docs === null) reject("Empty result");
            else resolve(docs);
        });
    });
}

export function submitCode(source_code, user_id) {
    return new Promise((resolve, reject) => {
        db.users.findOne({ _id: user_id }, function(err, docs) {
            if (err) reject(err);
            else if (!docs) reject("this username doesn't exists");
            else
                db.submissions.insert(
                    [
                        {
                            source_code,
                            status: "Pending",
                            date: new Date(),
                            user_id
                        }
                    ],
                    function(err2, docs2) {
                        if (err2) reject(err2);
                        else resolve(docs2._id);
                    }
                );
        });
    });
}

export function updateSubmission(sub_id, new_verdict) {
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

export function updateUser(user_id, old_pass, new_pass) {
    return new Promise((resolve, reject) => {
        db.users.update(
            { _id: user_id, pass: bcrypt.hashSync(old_pass) },
            { $set: { pass: bcrypt.hashSync(new_pass) } },
            { multi: false },
            function(err, docs) {
                if (err) reject(err);
                else if (docs === 0) reject("wrong password or username");
                else resolve("password changed");
            }
        );
    });
}
