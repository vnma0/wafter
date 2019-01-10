var Datastore = require("nedb"),
    db = new Datastore({ autoload: true });

import bcrypt from "bcrypt-nodejs";
import { join } from "path";
import { cwd } from "../config/cwd";

db = {};
db.users = new Datastore(join(cwd, "data", "users.db"));
db.submissions = new Datastore(join(cwd, "data", "submissions.db"));

db.users.loadDatabase();
db.submissions.loadDatabase();

/**
 * Validate username
 * NOTE: This function is being considered to be replaced
 * @param {String} username User's name
 */
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

/**
 * Add user to database
 * @param {String} username User's name
 * @param {String} pass User's password
 * @returns {Promise} User's ID if success
 */
export function newUser(username, pass) {
    return new Promise((resolve, reject) => {
        db.users.findOne({ username: username }, function (err, docs) {
            if (err) reject(err);
            else if (username.length > 32)
                reject("this username's length is too long");
            else if (pass.length > 32) reject("this password's length is too long");
            else if (usernameChecking(username) === false)
                reject("this username included invalid characters");
            else if (docs) {
                reject("this username has been taken");
                return;
            } else
                db.users.insert(
                    [{ username: username, pass: bcrypt.hashSync(pass) }],
                    function (err2, docs2) {
                        if (err2) reject(err2);
                        else resolve(docs2[0]._id);
                    }
                );
        });
    });
}

/**
 * Retrieve list of users in database
 * @returns {Promise} Array of user if success
 */
export function readAllUser() {
    return new Promise((resolve, reject) => {
        db.users.find({}, function (err, docs) {
            if (err) reject(err);
            else resolve(docs);
        });
    });
}

/**
 * Retrieve User's data in database by using username
 * @param {String} username User's id
 * @returns {Promise} User's info if success
 */
export function readUser(username) {
    return new Promise((resolve, reject) => {
        db.users.findOne({ username }, function (err, docs) {
            if (err) reject(err);
            else if (docs === null) reject("invalid username");
            else resolve(docs);
        });
    });
}

/**
 * Retrieve User's data in database by using user's id
 * @param {String} id User's id
 * @returns {Promise} User's info if success
 */
export function readUserByID(id) {
    return new Promise((resolve, reject) => {
        db.users.findOne({ _id: id }, function (err, docs) {
            if (err) reject(err);
            else if (docs === null) reject("invalid user_id");
            else resolve(docs);
        });
    });
}

/**
 * Update User's data in database
 * @param {String} user_id User's id
 * @param {String} username Username
 * @param {String} new_username New username
 * @param {String} old_pass Old password
 * @param {String} new_pass New password
 * 
 */
export function updateUser(user_id, username, new_username, old_pass, new_pass) {
    return new Promise((resolve, reject) => {
        db.users.findOne({ _id: user_id, username: username }, function (err, docs) {
            if (err) reject(err);
            else if (docs === null) {
                reject("invalid user");
            } else {
                db.users.findOne(
                    { username: new_username },
                    function (err1, docs1) {
                        if (err1) reject(err1);
                        else if (docs1 !== null && new_username !== username) reject("this username has been taken");
                        else bcrypt.compare(old_pass, docs.pass, function (err2, docs2) {
                            if (err2) reject(err2);
                            else if (docs2 === false) reject("wrong password");
                            else {
                                db.users.update(
                                    { _id: user_id, pass: docs.pass },
                                    { username: new_username, pass: bcrypt.hashSync(new_pass) },
                                    {},
                                    function (err3, docs3) {
                                        if (err3) reject(err3);
                                        else if (docs3 === 0) reject("nothing changed");
                                        else resolve("password changed");
                                    }
                                );
                            }
                        });
                    }
                )
            }
        });
    });
}

/**
 * Submission Schema Object
 * _id:             Submission's ID
 * source_code:     Source code path
 * status:          Submission Status
 * date:            Submission Date (Db first receive)
 * user_id:         User's ID of submission
 * prob_id:         Problem's ID of submission
 * score:           Submission's score (in OI)
 * penalty          Submission's penalty (in ACM)
 * ctype:           contest type OI / ACM
 * 
 * "Accepted" is the only verdict that will be count 
 */

/**
 * Retrieve list of submissions in database
 * @returns {Promise} Array of submission if success
 */
export function readAllSubmissions() {
    return new Promise((resolve, reject) => {
        db.submissions.find({}, function (err, docs) {
            if (err) reject(err);
            else resolve(docs);
        });
    });
}

/**
 * Retrieve submission via sub_id
 * @param {String} sub_id Submission's ID
 * @returns {Promise} Submission's details if success
 */
export function readSubmission(sub_id) {
    return new Promise((resolve, reject) => {
        db.submissions.findOne({ _id: sub_id }, function (err, docs) {
            if (err) reject(err);
            else if (docs === null) reject("invalid ID");
            else resolve(docs);
        });
    });
}

/**
 * Retrieve list of submission via user_id
 * @param {String} user_id User's ID
 * @returns {Promise} Array of user's submissions if success
 */
export function readUserSubmission(user_id) {
    return new Promise((resolve, reject) => {
        db.submissions.find({ user_id }, function (err, docs) {
            if (err) reject(err);
            else if (docs === null) reject("Empty result");
            else resolve(docs);
        });
    });
}

/**
 * Add submission to database
 * @param {String} source_code Source Code
 * @param {String} user_id User's ID
 * @param {String} prob_id Problem's ID
 * @param {String} ctype ACM / OI
 * @param {Number} index penalty if ACM 
 * @returns {Promise} Submission's ID if success
 */
export function submitCode(source_code, user_id, prob_id, ctype, index) {
    return new Promise((resolve, reject) => {
        db.users.findOne({ _id: user_id }, function (err, docs) {
            if (err) reject(err);
            else if (!docs) reject("this username doesn't exists");
            else {
                if (ctype === "ACM")
                    db.submissions.insert(
                        [
                            {
                                source_code,
                                status: "Pending",
                                date: new Date(),
                                user_id,
                                prob_id,
                                score: null,
                                penalty: index,
                                ctype
                            }
                        ],
                        function (err2, docs2) {
                            if (err2) reject(err2);
                            else resolve(docs2[0]._id);
                        }
                    );
                if (ctype === "OI")
                    db.submissions.insert(
                        [
                            {
                                source_code,
                                status: "Pending",
                                date: new Date(),
                                user_id,
                                prob_id,
                                score: null,
                                penalty: null,
                                ctype
                            }
                        ],
                        function (err2, docs2) {
                            if (err2) reject(err2);
                            else resolve(docs2[0]._id);
                        }
                    );
            }
        });
    });
}

/**
 * Update submission in database
 * @param {String} sub_id Submission's ID
 * @param {Object} new_verdict new verdict
 * @param {Number} score score if it is OI
 */
export function updateSubmission(sub_id, new_verdict, score) {
    return new Promise((resolve, reject) => {
        db.submissions.findOne(
            { _id: sub_id },
            function (err, docs) {
                if (err) reject(err);
                else if (docs === null) reject("no code found");
                else db.submissions.update(
                    { _id: sub_id },
                    {
                        source_code: docs.source_code,
                        status: new_verdict,
                        date: docs.date,
                        user_id: docs.user_id,
                        prob_id: docs.prob_id,
                        score: score,
                        penalty: docs.penalty,
                        ctype: docs.ctype
                    },
                    {},
                    function (err2, docs2) {
                        if (err2) reject(err2);
                        else if (docs2 === 0) reject("such submission exists");
                        else resolve("new verdict applied");
                    }
                );
            }
        )
    });
}

/**
 * Retreive the best submission among the list
 * @param {String} user_id user's id
 * @param {String} prob_id problem's id
 * @param {String} ctype contest's type
 * @returns {Promise} the best submission if possible, null if none exists
 */
export function bestSubmission(user_id, prob_id, ctype) {
    return new Promise((resolve, reject) => {
        if (ctype === "ACM" || ctype === "OI")
            db.submissions.find(
                { user_id, prob_id, status: "Accepted" },
                function (err, docs) {
                    if (err) reject(err);
                    else if (docs === null) resolve(null);
                    else {
                        docs.sort(function (a, b) { return (ctype === "ACM" ? a.penalty - b.penalty : b.score - a.score) })
                        resolve(docs[0]);
                    }
                }
            )
        else reject("wrong contest type");
    });
}

/**
 * Retrieve last Satisfy result
 * @param {String} sub_id Submission's ID
 * @returns {Promise} Submission's details if success
 */
export async function readLastSatisfy(user_id, prob_id, ctype) {
    return new Promise((resolve, reject) => {
        db.submissions.find(
            {
                user_id: user_id,
                prob_id: prob_id,
                ctype: ctype,
                status: { $ne: "Pending" }
            },
            function (err, docs) {
                docs.sort(function (a, b) { return a.date - b.date });
                if (err) reject(err);
                else if (!docs.length) resolve({});
                else resolve(docs.pop());
            }
        );
    });
}

/**
 * Count to last Satisfy result
 * @param {String} sub_id Submission's ID
 * @returns {Promise} Submission's details if success
 */
export async function countToSatisfy(sub_id) {
    return new Promise((resolve, reject) => {
        readSubmission(sub_id).then(
            (sub_data) => {
                db.submissions.count(
                    {
                        user_id: sub_data.user_id,
                        prob_id: sub_data.prob_id,
                        date: { $lt: sub_data.date },
                        ctype: sub_data.ctype,
                        status: { $ne: "Pending" },
                    },
                    function (err, docs) {
                        if (err) reject(err);
                        else resolve(docs + 1);
                    }
                );
            },
            (err) => {
                reject(err);
            }
        )

    });
}