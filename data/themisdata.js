import { resolve } from 'url';
import { isBuffer } from 'util';

var Datastore = require('nedb'), db = new Datastore({ autoload: true });
//db.persistence.setAutocompactionInterval(5001);

db = {};
db.users = new Datastore('data/users.db');
db.submissions = new Datastore('data/submissions.db');
db.problems = new Datastore('data/problems.db');
db.users.loadDatabase();
db.submissions.loadDatabase();
db.problems.loadDatabase();
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
    problem{
        _id:
        problemID:
        wlink:
        contest:
        // testcase[]{
        //     id:
        //     test:
        // }
    }
*/

// adding new problem
export async function newProblem(problemID, contest, wlink, testcases) {
    return new Promise((resolve, reject) => {
        db.problems.findOne(
            { problemID: problemID },
            function (err, docs) {
                if (err) reject(err);
                if (docs !== null) reject(err);
                else db.problems.insert(
                    { problemID: problemID, contest: contest, wlink: wlink, testcases: testcases },
                    function (err, docs2) {
                        if (err) reject(err);
                        else resolve(docs2);
                    }
                )
            }
        )
    });
}

//get problem by ID
export async function getProblem(problemID) {
    return new Promise((resolve, reject) => {
        db.problems.findOne(
            { problemID: problemID },
            function (err, docs) {
                if (err) reject(err);
                if (docs === null) reject(null);
                else resolve(docs);
            }
        )
    })
}

// checking if an username is valid
function usernameChecking(username) {
    for (let i = 0; i < username.length; i++) {
        var c = username[i];
        if (!(('0' <= c && c <= '9') || ('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z'))) return false;
    }
    return true;
}

// adding new user
export async function newUser(username, pass) {
    return new Promise((resolve, reject) => {
        db.users.findOne(
            { username: username },
            function (err, docs) {
                if (err) reject(err);
                // making sure that the lengths meet the requirements
                else if (username.length > 32) reject(null);
                // making sure that the lengths meet the requirements
                else if (pass.length > 32) reject(null);
                // making sure there isn't any invalid character
                else if (usernameChecking(username) === false) reject(null);
                // making sure the username hasn't been taken
                else if (docs !== null) reject(null);
                // creating new user
                else db.users.insert(
                    [{ username: username, pass: pass }],
                    function (err, docs2) {
                        if (err) reject(err);
                        else resolve(docs2);
                    }
                );
            }
        );
    });
}

// get user's properties
export async function readUserByUsername(username) {
    return new Promise((resolve, reject) => {
        db.users.findOne(
            { username: username },
            function (err, docs) {
                if (err) reject(err);
                // making sure that the username is valid
                if (docs === null) reject(null);
                // return user's properties
                else resolve(docs);
            }
        )
    });
}

// get user's properties by ID
export async function readUserByID(user_id) {
    return new Promise((resolve, reject) => {
        db.users.findOne(
            { _id: user_id },
            function (err, docs) {
                if (err) reject(err);
                // making sure that the username is valid
                if (docs === null) reject(null);
                // return user's properties
                else resolve(docs);
            }
        )
    });
}

// reading the submission's properties by id
export async function readSubmission(sub_id) {
    return new Promise((resolve, reject) => {
        db.submissions.findOne(
            { _id: sub_id },
            function (err, docs) {
                if (err) reject(err);
                // making sure that the id is valid
                if (docs === null) reject(null);
                // return the submission's properties
                else resolve(docs);
            }
        )
    });
}

// submitting the code
export async function submitCode(source_code, username, problemID) {
    return new Promise((resolve, reject) => {
        db.users.findOne(
            { username: username },
            function (err, docs) {
                if (err) reject(err);
                // making sure the username is valid
                if (docs === null) reject(null);
                // submitting the code
                else db.submissions.insert(
                    [{ source_code: source_code, status: "pending", date: new Date(), username: username, problemID: problemID }],
                    function (err, docs2) {
                        if (err) reject(err);
                        else resolve(docs2);
                    }
                )
            }
        )
    });
};

//getting user's submissions
export async function getUserSubmissions(username) {
    return new Promise((resolve, reject) => {
        db.submissions.find(
            { username: username },
            function (err, docs) {
                if (err) reject(err);
                // return an array of objects that represent user's submissions
                else resolve(docs);
            }
        )
    });
}

//get problem's submissions
export async function getProblemSubmissions(problemID) {
    return new Promise((resolve, reject) => {
        db.submissions.find(
            { problemID: problemID },
            function (err, docs) {
                if (err) reject(err);
                // return an array of objects that represent problem's submissions
                else resolve(docs);
            }
        )
    });
}


// testing
// newUser("user1", "password").then(console.log).catch(console.log);
// readUserByUsername("user1").then(console.log).catch(console.log);
// submitCode("this is source code 1", "user1", "A").then(console.log).catch(console.log);
// readSubmission("OVdJBSsIsZOnLdrA").then(console.log).catch(console.log);
// submitCode("this is source code 2", "user1", "A").then(console.log).catch(console.log);
// readSubmission("h8vhdOAGSBw2QIx1").then(console.log).catch(console.log);
// getUserSubmissions("user1").then(console.log).catch(console.log);
// getProblemSubmissions("user1").then(console.log).catch(console.log);

/*
    nodemon --exec npx babel-node .\data\themisdata.js
*/
