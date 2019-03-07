"use strict";

const bcrypt = require("bcryptjs");
const { join } = require("path");
const cwd = require("../config/cwd");
const Datastore = require("nedb");
const { isUsername, isPassword } = require("../util/userValid");

let db = {};
db.users = new Datastore({
    filename: join(cwd, "data", "users.db"),
    autoload: true
});
db.users.persistence.setAutocompactionInterval(5000);
db.submissions = new Datastore({
    filename: join("data", "submissions.db"),
    autoload: true
});
db.submissions.persistence.setAutocompactionInterval(5000);

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
 * Add user to database
 * @param {String} username User's name
 * @param {String} pass User's password
 * @param {Boolean} isAdmin Is user's an admin
 * @returns {Promise} User's ID if success
 */
async function newUser(username, pass, isAdmin = false) {
    // TODO: Simplify these code
    const passHash = bcrypt.hash(pass, bcrypt.genSaltSync(10));
    try {
        await readUser(username);
        throw new Error("Username has been taken");
    } catch (err) {
        if (err.message !== "Invalid username") throw err;
    }
    if (!isPassword(pass)) throw new Error("Invalid password's length");
    else if (!isUsername(username))
        throw new Error("Username included invalid characters");
    else {
        const hashedPass = await passHash;
        return new Promise((resolve, reject) => {
            db.users.insert(
                [
                    {
                        username: username,
                        pass: hashedPass,
                        isAdmin: !!isAdmin
                    }
                ],
                function(err, docs) {
                    if (err) reject(err);
                    else resolve(docs[0]._id);
                }
            );
        });
    }
}

/**
 * Retrieve list of users in database
 * @returns {Promise} Array of user if success
 */
function readAllUser(includeAdmin = false) {
    let isAdminSchema = [false];
    if (includeAdmin) isAdminSchema.push(true);
    return new Promise((resolve, reject) => {
        db.users.find(
            { isAdmin: { $in: isAdminSchema } },
            { username: 1, isAdmin: 1 },
            function(err, docs) {
                if (err) reject(err);
                else resolve(docs);
            }
        );
    });
}

/**
 * Retrieve User's data in database by using username
 * @param {String} username User's id
 * @returns {Promise} User's info if success
 */
function readUser(username) {
    return new Promise((resolve, reject) => {
        db.users.findOne(
            { username: username },
            { username: 1, isAdmin: 1 },
            function(err, docs) {
                if (err) reject(err);
                else if (docs === null) reject(new Error("Invalid username"));
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
function readUserByID(id) {
    return new Promise((resolve, reject) => {
        db.users.findOne({ _id: id }, { username: 1, isAdmin: 1 }, function(
            err,
            docs
        ) {
            if (err) reject(err);
            else if (docs === null) reject(new Error(`Invalid user_id: ${id}`));
            else resolve(docs);
        });
    });
}

/**
 * Retrieve User's hash in database by using user's id
 * @param {String} id User's id
 * @returns {Promise} User's info if success
 */
function readUserPassHash(id) {
    return new Promise((resolve, reject) => {
        db.users.findOne({ _id: id }, { pass: 1 }, function(err, docs) {
            if (err) reject(err);
            else if (docs === null) reject(new Error(`Invalid user_id: ${id}`));
            else resolve(docs.pass);
        });
    });
}

/**
 * Update user's name
 * @param {String} user_id User's id
 * @param {String} old_name Old username
 * @param {String} new_name New username
 */
async function updateUserName(user_id, old_name, new_name) {
    if (!isUsername(new_name)) throw new Error("Invalid new name");
    const dbUserID = await readUserByID(user_id);

    try {
        await readUser(new_name);
        throw new Error("Username has been taken");
    } catch (err) {
        if (err.message !== "Invalid username") throw err;
    }

    if (dbUserID.username !== old_name)
        throw new Error("Mismatch between username and user_id");

    return new Promise((resolve, reject) => {
        db.users.update(
            { _id: user_id, username: dbUserID.username },
            {
                $set: {
                    username: new_name
                }
            },
            {},
            function(err, numAffected) {
                if (err) reject(err);
                else if (numAffected === 0)
                    reject(new Error("Nothing changed"));
                else resolve("Username changed");
            }
        );
    });
}

/**
 * Update user's password
 * @param {String} user_id User's id
 * @param {String} old_pass Old password
 * @param {String} new_pass New password
 */
async function updateUserPassword(user_id, old_pass, new_pass) {
    if (!isPassword(new_pass)) throw new Error("Invalid new password");
    const newHashPass = bcrypt.hash(new_pass, bcrypt.genSaltSync(10));

    const dbUserPassHash = await readUserPassHash(user_id);

    // Carefully qualify so no memory leak happen
    const isHashMatch = bcrypt.compare(old_pass, dbUserPassHash);

    if (!(await isHashMatch)) throw new Error("Wrong password");

    const newHash = await newHashPass;
    return new Promise((resolve, reject) => {
        db.users.update(
            { _id: user_id, pass: dbUserPassHash },
            {
                $set: {
                    pass: newHash
                }
            },
            {},
            function(err, numAffected) {
                if (err) reject(err);
                else if (numAffected === 0)
                    reject(new Error("Nothing changed"));
                else resolve("Password changed");
            }
        );
    });
}

// /**
//  * Submission Schema Object
//  * _id:             Submission's ID
//  * source_code:     Source code path
//  * ext:             Source code extension
//  * status:          Submission Status
//  * date:            Submission Date (Db first receive)
//  * user_id:         User's ID of submission
//  * prob_id:         Problem's ID of submission
//  * score:           Submission's score (like in OI)
//  * tpen:            Submission's penalty (like in ACM)
//  * tests:           Submission's tests result
//  */

/**
 * @typedef {Object} ReturnSubmission
 * @property {String} _id Submission's ID
 * @property {Number} ext Source code's extension
 * @property {String} status Submission's Status
 * @property {Date} date Submission's Date
 * @property {String} user_id Submission's User's ID
 * @property {String} prob_id Submission's Problem ID
 * @property {Number} score Submission's score
 * @property {Number} tpen Submission's penalty
 * @property {Array<TestCase>} tests Submission's tests result
 */

/**
 * Count number of submissions
 */
function countSubmissions(user_id) {
    let query = {};
    if (user_id) query = { user_id };
    return new Promise((resolve, reject) => {
        db.submissions.count(query, function(err, count) {
            if (err) reject(err);
            else resolve(count);
        });
    });
}

/**
 * Verify page, count, size value so it will work
 */
function verifySubsQuery(page, size, count, maxSize) {
    if (isNaN(page) || page < 0) page = 0;
    if (isNaN(size) || size < 0) size = 20;
    if (isNaN(count) || count < 1 || count > maxSize) count = maxSize;
    return { page, size, count };
}

/**
 *
 * Retrieve list of submissions in database
 * @param {Number} page page number
 * @param {Number} count number of subs limited in the selected
 * @param {Number} size limit the size of page
 * @returns {Promise<Array<ReturnSubmission>>} Array of submission if success
 */
async function readAllSubmissions(page, size, count) {
    const maxSize = await countSubmissions();
    ({ page, size, count } = verifySubsQuery(page, size, count, maxSize));

    return new Promise((resolve, reject) => {
        db.submissions
            .find(
                {},
                {
                    ext: 1,
                    status: 1,
                    date: 1,
                    user_id: 1,
                    prob_id: 1,
                    score: 1,
                    tpen: 1,
                    tests: 1
                }
            )
            .sort({ date: -1 })
            .skip(size * page - count + maxSize)
            .limit(size)
            .exec((err, docs) => {
                // TODO: Decide what to do when there's invalid user
                // Currently, it will throw error with invalid user_id
                if (err) reject(err);
                else
                    Promise.all(
                        docs.map((doc) => readUserByID(doc.user_id))
                    ).then((usernameList) => {
                        let serialized = docs.map((doc, idx) => {
                            doc.username = usernameList[idx].username;
                            return doc;
                        });
                        resolve({
                            data: serialized,
                            page: page,
                            size: size,
                            count: count
                        });
                    });
            });
    });
}

/**
 * Retrieve submission via sub_id
 * @param {String} sub_id Submission's ID
 * @returns {Promise<ReturnSubmission>} Submission's details if success
 */
function readSubmission(sub_id) {
    return new Promise((resolve, reject) => {
        db.submissions.findOne(
            { _id: sub_id },
            {
                ext: 1,
                status: 1,
                date: 1,
                user_id: 1,
                prob_id: 1,
                score: 1,
                tpen: 1,
                tests: 1
            },
            function(err, docs) {
                if (err) reject(err);
                else if (docs === null)
                    reject(new Error(`Invalid Submission's ID: ${sub_id}`));

                readUserByID(docs.user_id)
                    .then((res) => {
                        docs.username = res.username;
                    })
                    .finally(() => {
                        resolve(docs);
                    });
            }
        );
    });
}

/**
 *
 * Retrieve list of submission via user_id
 * @param {String} user_id User's ID
 * @param {Number} page page number
 * @param {Number} count number of subs limited in the selected
 * @param {Number} size limit the size of page
 * @returns {Promise<Array<ReturnSubmission>>} Array of user's submissions if success
 */
async function readUserSubmission(user_id, page, size, count) {
    const userData = await readUserByID(user_id);
    const maxSize = await countSubmissions(user_id);
    ({ page, size, count } = verifySubsQuery(page, size, count, maxSize));

    return new Promise((resolve, reject) => {
        db.submissions
            .find(
                { user_id: user_id },
                {
                    ext: 1,
                    status: 1,
                    date: 1,
                    user_id: 1,
                    prob_id: 1,
                    score: 1,
                    tpen: 1,
                    tests: 1
                }
            )
            .sort({ date: -1 })
            .skip(size * page - count + maxSize)
            .limit(size)
            .exec((err, docs) => {
                if (err) reject(err);
                else {
                    let serialized = docs.map((doc) => {
                        doc.username = userData.username;
                        return doc;
                    });
                    resolve({
                        data: serialized,
                        page: page,
                        size: size,
                        count: count
                    });
                }
            });
    });
}

/**
 * Add submission to database
 * @param {String} source_code Source Code
 * @param {String} user_id User's ID
 * @param {String} prob_id Problem's ID
 * @param {Number} tpen Submission's penalty
 * @param {Number} ext Source code's extension
 * @returns {Promise<String>} Submission's ID if success
 */
async function newSubmission(source_code, user_id, prob_id, tpen, ext) {
    await readUserByID(user_id);
    return new Promise((resolve, reject) => {
        db.submissions.insert(
            [
                {
                    source_code,
                    ext,
                    status: "Pending",
                    date: new Date(),
                    user_id,
                    prob_id,
                    tpen,
                    score: null,
                    tests: null
                }
            ],
            function(err, docs) {
                if (err) reject(err);
                else resolve(docs[0]._id);
            }
        );
    });
}

/**
 * Update submission in database
 * @param {String} sub_id Submission's ID
 * @param {Object} new_verdict new verdict
 * @param {Number} score score
 */
async function updateSubmission(sub_id, new_verdict, score, tests) {
    try {
        await readSubmission(sub_id);
    } catch (err) {
        throw new Error(`Incorrect reference: ${sub_id}`);
    }
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
            function(err, numAffected) {
                if (err) reject(err);
                else if (numAffected === 0)
                    reject(Error(`Failed to update sub_id ${sub_id}`));
                else resolve("New verdict applied");
            }
        );
    });
}

/**
 * Retrieve last Satisfy result
 * @deprecated
 * @param {String} user_id user's id
 * @param {String} prob_id problem's id
 * @returns {Promise} Submission's details if success
 */
async function readLastSatisfy(user_id, prob_id) {
    return new Promise((resolve, reject) => {
        db.submissions
            .find({
                user_id: user_id,
                prob_id: prob_id,
                status: { $ne: "Pending" }
            })
            .sort({ date: -1 })
            .exec((err, docs) => {
                if (err) reject(err);
                else if (!docs.length) resolve({});
                else resolve(docs.pop());
            });
    });
}

/**
 * Count to last Satisfy result
 * @param {String} sub_id Submission's ID
 * @returns {Promise<Number>} Number of satisfy submissions
 */
async function countPreviousSatisfy(sub_id) {
    return new Promise((resolve, reject) => {
        readSubmission(sub_id).then(
            (sub_data) => {
                db.submissions.count(
                    {
                        user_id: sub_data.user_id,
                        prob_id: sub_data.prob_id,
                        date: { $lt: sub_data.date },
                        status: { $ne: "Pending" }
                    },
                    function(err, docs) {
                        if (err) reject(err);
                        else resolve(docs);
                    }
                );
            },
            (err) => {
                reject(err);
            }
        );
    });
}

/**
 * Retreive the best submission among the list
 * @param {String} user_id user's id
 * @param {String} prob_id problem's id
 * @param {ContestType} ctype contest's type
 * @returns {Promise<ReturnSubmission>} the best submission if possible, null if none exists
 */
function bestSubmission(user_id, prob_id, ctype) {
    return new Promise((resolve, reject) => {
        db.submissions
            .find({
                user_id: user_id,
                prob_id: prob_id,
                status: { $in: ctype.acceptedStatus }
            })
            .sort({ date: -1 })
            .exec((err, docs) => {
                if (err) reject(err);
                else if (!docs.length) resolve(null);
                else {
                    docs.sort(ctype.sortSub);
                    let doc = docs[0];
                    countPreviousSatisfy(doc._id).then((atmp) => {
                        doc.attempt = atmp + 1;
                        resolve(doc);
                    });
                }
            });
    });
}

module.exports = {
    newUser,
    readAllUser,
    readUser,
    readUserByID,
    readUserPassHash,
    updateUserName,
    updateUserPassword,
    readAllSubmissions,
    readSubmission,
    readUserSubmission,
    newSubmission,
    updateSubmission,
    readLastSatisfy,
    countPreviousSatisfy,
    bestSubmission
};
