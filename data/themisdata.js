import { resolve } from 'url';
import { isBuffer } from 'util';

var Datastore = require('nedb')
    , db = new Datastore({ autoload: true });
//db.persistence.setAutocompactionInterval(5001);

db = {};
db.users = new Datastore('data/users.db');
db.submissions = new Datastore('data/submissions.db');

db.users.loadDatabase();
db.submissions.loadDatabase();

//db.persistence.setAutocompactionInterval(5001);

/*
    mô tả về các tuple trong database của users và submissions
    code{
        _id: (hidden)
        openID:
        problem ID:
        username:
        source_code:
        date:
        status:
    }
    user{
        _id: (hidden)
        username:
        pass:
    }
*/



function usernameChecking(username) {
    for (let i = 0; i < username.length; i++) {
        if (username[i] === ' ') return false;
    }
    return true;
}
export async function newUser(username, pass) {
    return new Promise((resolve, reject) => {
        if (pass.length > 32) reject("the maximum length allowed is 32");
        db.users.findOne(
            { username: username },
            function (err, docs) {
                if (err) reject("error");
                if (username.length > 32) reject("the maximum length allowed is 32");
                if (docs !== null) reject("this username has already been taken");
            }
        );
        if (usernameChecking(username) === false) reject("invalid characters included");
        db.users.insert(
            [{ username: username, pass: pass }],
            function (err, docs) {
                if (err) reject("error");
                else resolve("new user created");
            }
        );
    });
}


export async function readUser(username) {
    return new Promise((resolve, reject) => {
        db.submissions.findOne(
            { username: username },
            function (err, docs) {
                if (err) reject("error");
                if (docs === null) reject("invalid user");
                else resolve(docs);
            }
        )
    });
}

export async function readSubmission(sub_id) {
    return new Promise((resolve, reject) => {
        db.submissions.findOne(
            { _id: sub_id },
            function (err, docs) {
                if (err) reject("error");
                if (docs === null) reject("invalid id");
                else resolve(docs);
            }
        )
    });
}

export async function submitCode(source_code, username, problemID) {
    /*
    var openID;
    db.submissions.count({}, function (err, docs) { openID = docs; });
    openID += 1;
    */
    return new Promise((resolve, reject) => {
        db.users.findOne(
            { username: username },
            function (err, docs) {
                if (err) reject("error");
                if (docs === null) reject("user not found");
            }
        )
        db.submissions.insert(
            [{ source_code: source_code, status: "pending", date: new Date(), username: username, problemID: problemID }],
            function (err, docs) {
                if (err) reject("error");
                else resolve("submitted");
            }
        )
    });
};


function writeLog(username, logfile) {
    db.users.insert([logfile], function (err, docs) { });
}

newUser('dmcs', 'vnch').then(console.log).catch(console.log);
//submitCode('viet nam cong hoa se phuc quoc thanh cong vao nam n+1','dmcs','A1').then(console.log).catch(console.log);
/*
    nodemon --exec npx babel-node .\data\themisdata.js
*/
