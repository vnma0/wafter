"use strict";

const console = require("console");
const fs = require("fs");
const path = require("path");
const cwd = require("../../config/cwd.js");
const Datastore = require("nedb");

var pad = (a, b) => "0".repeat(String(b).length - String(a).length) + a;

// convenience
let join = path.join;

let db = {};

const exportDir = join(cwd, "export");
if (!fs.existsSync(exportDir))
    fs.mkdirSync(exportDir);
const exportSubDir = join(exportDir, "subs");
if (!fs.existsSync(exportSubDir))
    fs.mkdirSync(exportSubDir);

module.exports = async (verbose = false) => {
    // load user database
    process.stdout.write("Loading user database...");
    db.users = new Datastore({
        filename: join(cwd, "data", "users.db"),
        autoload: true
    });
    db.users.persistence.compactDatafile();
    process.stdout.write("Done! Scanning...");

    var userList = (user_id) => new Promise((resolve, reject) => {
        db.users.find((user_id ? {_id : user_id} : {}), (err, docs) => {
            if (err) reject(err);
            else resolve(docs);
        });
    });
    await userList().then(async (data) => console.log(`\x1b[36m${data.length}\x1b[0m users are loaded.`));

    // load submissions database
    process.stdout.write("Loading submissions database...");
    db.submissions = new Datastore({
        filename: join(cwd, "data", "submissions.db"),
        autoload: true
    });
    db.submissions.persistence.compactDatafile();
    console.log("Done!");
    
    var submissionList = () => new Promise((resolve, reject) => {
        db.submissions.find({}, (err, docs) => {
            if (err) reject(err);
            else resolve(docs);
        });
    });


    await submissionList()
        .then(async (data) => {
            console.log(`Loading submissions... \x1b[33m${data.length}\x1b[0m submissions found!`);
            
            for (const [index, sub] of data.entries()) {
                let subPath = join(cwd, sub.source_code.replace("\\", path.sep));

                if (verbose) {
                    console.log(`(${pad(index + 1, data.length)}/${data.length}) Processing file \x1b[36m${subPath}\x1b[0m`);
                }
                else {
                    process.stdout.write(`Processing submissions (${index + 1}/${data.length})...\r`);
                }

                // start working
                await userList(sub.user_id).then((userId) => {
                    // get username and log it
                    const user = userId.length ? userId[0].username : sub.user_id;

                    if (verbose)
                        console.log(`\t(submitted by \x1b[32m${user}\x1b[0m %s)`, (
                            (["Pending", null].indexOf(sub.status) !== -1)
                                ? "but not evaluated"
                                : `and judged \x1b[36m${sub.status}\x1b[0m`
                        ));

                    try {
                        // copy submission
                        if (verbose)
                            console.log("\t\tCopying submission's source file...");
                        const outName = `${sub.prob_id}_${user}_${sub.status}_${path.basename(subPath)}`;
                        fs.copyFileSync(subPath, join(exportSubDir, outName + sub.ext));

                        // alter the schema a little to hide user_id
                        delete sub.user_id; delete sub.source_code; sub.user = user;
                        
                        // write log
                        const logFile = join(exportSubDir, `${outName}.log.json`);
                        if (verbose)
                            console.log("\t\tWriting metadata to \x1b[33m%s\x1b[0m", logFile);
                        fs.writeFileSync(logFile, JSON.stringify(sub, null, 4));
                    } catch (e) {
                        // silently ignored
                        console.log(`\tError occurred during processing ${subPath}.`);
                    }
                });
            }

            console.log(`\nSuccessfully exported \x1b[33m${data.length}\x1b[0m submissions to \x1b[32m%s\x1b[0m.\n`, "export/subs/");
        });
};

