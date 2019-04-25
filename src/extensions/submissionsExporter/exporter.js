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
    db.users = new Datastore({
        filename: join(cwd, "data", "users.db"),
        autoload: true
    });
    db.users.persistence.compactDatafile();
    db.submissions = new Datastore({
        filename: join(cwd, "data", "submissions.db"),
        autoload: true
    });
    db.submissions.persistence.compactDatafile();
    
    var userList = (user_id) => new Promise((resolve, reject) => {
        db.users.find((user_id ? {_id : user_id} : {}), (err, docs) => {
            if (err) reject(err);
            else resolve(docs);
        });
    });
    
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
                    console.log(`(${pad(index + 1, data.length)}/${data.length}) Processing file ${subPath}`);
                }
                else {
                    process.stdout.write(`Processing submissions (${index + 1}/${data.length})...\r`);
                }

                // start working
                const targetFileBasename = join(exportSubDir, path.basename(subPath));
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
                        fs.copyFileSync(subPath, `${targetFileBasename}_${user}_${sub.status}${sub.ext}`);

                        // alter the schema a little to hide user_id
                        delete sub.user_id; delete sub.source_code; sub.user = user;

                        // write log
                        if (verbose)
                            console.log("\t\tWriting metadata to \x1b[33m%s\x1b[0m", `${targetFileBasename}.log.json`);
                        fs.writeFileSync(`${targetFileBasename}.log.json`, JSON.stringify(sub, null, 4));
                    } catch (e) {
                        // silently ignored
                        console.log(`\tError occurred during processing ${targetFileBasename}.`);
                    }
                });
            }

            console.log(`Successfully exported ${data.length} submissions to \x1b[32m%s\x1b[0m\n`, "export/subs/");
        });
};

