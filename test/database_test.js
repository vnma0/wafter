import {
    newUser,
    readUser,
    submitCode,
    readSubmission,
    updateUser,
    updateSubmission,
    readAllUser,
    readAllSubmissions
} from "../data/database";

const sampleUser = "sampleuser";
const samplePass = "samplepassword";
const sampleProb = "sampleprob";
const sampleCode = "samplecode";
let sampleID;
const sampleVer = "sampleverdict";

describe("database", function() {
    describe("newUser", function() {
        it("should be adding user", function() {
            return newUser(sampleUser, samplePass).then(
                (id) => {
                    sampleID = id;
                },
                (err) => {
                    throw err;
                }
            );
        });
    });

    describe("readUser", function() {
        it("should be returning an object represents user's properties", function() {
            return readUser(sampleUser);
        });
    });

    describe("readAllUser", function() {
        it("should return an array of users", function() {
            return readAllUser();
        });
    });

    describe("submitCode", function() {
        it("should be submitting code", function() {
            return submitCode(sampleCode, sampleID, sampleProb);
        });
    });

    describe("readSubmission", function() {
        it("should be returning an object represents submission's props", function() {
            return readSubmission(sampleID);
        });
    });

    describe("readAllSubmissions", function() {
        it("should return an array of submissions", function() {
            return readAllSubmissions();
        });
    });

    describe("updateSubmission", function() {
        it("should be updating verdict", function() {
            return updateSubmission(sampleID, sampleVer);
        });
    });

    describe("updateUser", function() {
        it("should be update user's password", function() {
            return updateUser(sampleUser, samplePass, samplePass);
        });
    });
});
