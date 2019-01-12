var Datastore = require("nedb"),
    db = new Datastore({ autoload: true });

import bcrypt from "bcryptjs";
import { join } from "path";
import { cwd } from "../config/cwd";

db = {};
db.users = new Datastore(join(cwd, "data", "users.db"));
db.submissions = new Datastore(join(cwd, "data", "submissions.db"));

db.users.loadDatabase();
db.submissions.loadDatabase();

/**
 * User Schema Object
 * _id:             User's ID
 * username:        User's Name
 * pass:            User's password
 * isAdmin:         True if user is admin
 *
 * "Accepted" is the only verdict that will be count
 */

/**
 * Validate username
 * NOTE: This function is being considered to be replaced
 * @param {String} username User's name
 */
function usernameChecking(username) {
    if (username.length > 32) return false;
    for (let i = 0; i < username.length; i++) {
        var c = username[i];
        // TODO: Simplify validator
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
export async function newUser(username, pass, isAdmin = false) {
    // TODO: Simplify these code
    const passHash = bcrypt.hash(pass, bcrypt.genSaltSync(10));
    try {
        await readUser(username);
        throw "this username has been taken";
    } catch (err) {
        if (err !== "invalid username") throw err;
    }
    if (pass.length > 32) throw "this password's length is too long";
    else if (!usernameChecking(username))
        throw "this username included invalid characters";
    else {
        const hashedPass = await passHash;
        return new Promise((resolve, reject) => {
            db.users.insert(
                [
                    {
                        username: username,
                        pass: hashedPass,
                        isAdmin: isAdmin
                    }
                ],
                function(err2, docs2) {
                    if (err2) reject(err2);
                    else resolve(docs2[0]._id);
                }
            );
        });
    }
}

/**
 * Retrieve list of users in database
 * @returns {Promise} Array of user if success
 */
export function readAllUser() {
    return new Promise((resolve, reject) => {
        db.users.find({}, { username: 1, isAdmin: 1 }, function(err, docs) {
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
        db.users.findOne(
            { username: username },
            { username: 1, isAdmin: 1 },
            function(err, docs) {
                if (err) reject(err);
                else if (docs === null) reject("invalid username");
                else resolve(docs);
            }
        );
    });
}

/**
 * Retrieve User's data in database by using user's id
 * @param {String} id User's id
 * @returns {Promise} User's info if success
 */
export function readUserByID(id) {
    return new Promise((resolve, reject) => {
        db.users.findOne({ _id: id }, { username: 1, isAdmin: 1 }, function(
            err,
            docs
        ) {
            if (err) reject(err);
            else if (docs === null) reject("invalid user_id");
            else resolve(docs);
        });
    });
}

/**
 * Retrieve User's hash in database by using user's id
 * @param {String} id User's id
 * @returns {Promise} User's info if success
 */
export function readUserPassHash(id) {
    return new Promise((resolve, reject) => {
        db.users.findOne({ _id: id }, { pass: 1 }, function(err, docs) {
            if (err) reject(err);
            else if (docs === null) reject("invalid user_id");
            else resolve(docs.pass);
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
export async function updateUser(
    user_id,
    username,
    new_username,
    old_pass,
    new_pass
) {
    const dbUserID = await readUserByID(user_id);
    const dbUserPassHash = await readUserPassHash(user_id);

    // TODO: Carefully qualify so no memory leak happen
    const isHashMatch = bcrypt.compare(old_pass, dbUserPassHash);
    const newHashPass = bcrypt.hash(new_pass, bcrypt.genSaltSync(10));

    if (dbUserID.username !== username) throw "Invalid user";

    if (username !== new_username)
        try {
            await readUser(new_username);
            throw "this username has been taken";
        } catch (err) {
            if (err !== "invalid username") throw err;
        }

    if (!(await isHashMatch)) throw "Wrong password";

    const newHash = await newHashPass;
    return new Promise((resolve, reject) => {
        db.users.update(
            { _id: user_id, pass: dbUserPassHash, username: username },
            {
                $set: {
                    username: new_username,
                    pass: newHash
                }
            },
            {},
            function(err, numAffected) {
                if (err) reject(err);
                else if (numAffected === 0) reject("nothing changed");
                else resolve("password changed");
            }
        );
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
 * tpen             Submission's penalty (in ACM)
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
        db.submissions.find(
            {},
            {
                status: 1,
                date: 1,
                user_id: 1,
                prob_id: 1,
                score: 1,
                ctype: 1,
                tpen: 1
            },
            function(err, docs) {
                if (err) reject(err);
                else resolve(docs);
            }
        );
    });
}

/**
 * Retrieve submission via sub_id
 * @param {String} sub_id Submission's ID
 * @returns {Promise} Submission's details if success
 */
export function readSubmission(sub_id) {
    return new Promise((resolve, reject) => {
        db.submissions.findOne(
            { _id: sub_id },
            {
                status: 1,
                date: 1,
                user_id: 1,
                prob_id: 1,
                score: 1,
                ctype: 1,
                tpen: 1
            },
            function(err, docs) {
                if (err) reject(err);
                else if (docs === null) reject("invalid ID");
                else resolve(docs);
            }
        );
    });
}

/**
 * Retrieve list of submission via user_id
 * @param {String} user_id User's ID
 * @returns {Promise} Array of user's submissions if success
 */
export function readUserSubmission(user_id) {
    return new Promise((resolve, reject) => {
        db.submissions.find(
            { user_id: user_id },
            {
                status: 1,
                date: 1,
                user_id: 1,
                prob_id: 1,
                score: 1,
                ctype: 1,
                tpen: 1
            },
            function(err, docs) {
                if (err) reject(err);
                else if (docs === null) reject("Empty result");
                else resolve(docs);
            }
        );
    });
}

/**
 * Add submission to database
 * @param {String} source_code Source Code
 * @param {String} user_id User's ID
 * @param {String} prob_id Problem's ID
 * @param {String} ctype ACM / OI
 * @param {Number} index tpen if ACM
 * @returns {Promise} Submission's ID if success
 */
export async function submitCode(source_code, user_id, prob_id, ctype, index) {
    await readUserByID(user_id);
    return new Promise((resolve, reject) => {
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
                        tpen: index,
                        tests: null,
                        ctype
                    }
                ],
                function(err2, docs2) {
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
                        tpen: null,
                        tests: null,
                        ctype
                    }
                ],
                function(err2, docs2) {
                    if (err2) reject(err2);
                    else resolve(docs2[0]._id);
                }
            );
    });
}

/**
 * Update submission in database
 * @param {String} sub_id Submission's ID
 * @param {Object} new_verdict new verdict
 * @param {Number} score score if it is OI
 */
export async function updateSubmission(sub_id, new_verdict, score, tests) {
    const doc = await readSubmission(sub_id);
    if (doc.status !== "Pending") throw "Submission was updated";
    return new Promise((resolve, reject) => {
        db.submissions.update(
            { _id: sub_id },
            {
                $set: {
                    status: new_verdict,
                    score: score,
                    tests: tests
                }
            },
            {},
            function(err2, numAffected) {
                if (err2) reject(err2);
                else if (numAffected === 0) reject("failed to update");
                else resolve("new verdict applied");
            }
        );
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
                { user_id: user_id, prob_id: prob_id, status: "Accepted" },
                function(err, docs) {
                    if (err) reject(err);
                    else if (docs === null) resolve(null);
                    else {
                        docs.sort(function(a, b) {
                            return ctype === "ACM"
                                ? a.tpen - b.tpen
                                : b.score - a.score;
                        });
                        resolve(docs[0]);
                    }
                }
            );
        else reject("wrong contest type");
    });
}

/**
 * Retrieve last Satisfy result
 * @param {String} user_id user's id
 * @param {String} prob_id problem's id
 * @param {String} ctype contest's type
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
            function(err, docs) {
                docs.sort(function(a, b) {
                    return a.date - b.date;
                });
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
export async function countPreviousSatisfy(sub_id) {
    return new Promise((resolve, reject) => {
        readSubmission(sub_id).then(
            (sub_data) => {
                db.submissions.count(
                    {
                        user_id: sub_data.user_id,
                        prob_id: sub_data.prob_id,
                        date: { $lt: sub_data.date },
                        ctype: sub_data.ctype,
                        status: { $ne: "Pending" }
                    },
                    function(err, docs) {
                        if (err) reject(err);
                        else resolve(docs + 1);
                    }
                );
            },
            (err) => {
                reject(err);
            }
        );
    });
}
