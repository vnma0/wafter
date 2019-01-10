import {
    newUser,
    readUser,
    submitCode,
    readSubmission,
    updateUser,
    updateSubmission,
    readAllUser,
    readAllSubmissions,
    countSatisfy,
    lastSatisfy
} from "../data/database";
import { resolve } from "dns";

const sampleUser = Math.random()
    .toString(36)
    .substr(2, 5);
const samplePass = "samplepassword";
const sampleProb = "sampleprob";
const sampleCode = "samplecode";
const sampleRandom = Math.random()
    .toString(36)
    .substr(2, 5);
let sampleID, sampleCodeID;

const sampleVer = "Accepted";

describe("database", function () {
    describe("newUser", function () {
        it("should be adding user", function () {
            return newUser(sampleUser, samplePass).then(
                id => {
                    sampleID = id;
                },
                err => {
                    throw err;
                }
            );
        });
    });

    describe("readUser", function () {
        it("should be returning an object represents user's properties", function () {
            return readUser(sampleUser);
        });
    });

    describe("readAllUser", function () {
        it("should return an array of users", function () {
            return readAllUser();
        });
    });

    describe("submitCode", function () {
        it("should be submitting code", function () {
            return submitCode(sampleCode, sampleID, sampleProb, "OI", null).then(
                id => {
                    sampleCodeID = id;
                },
                err => {
                    throw err;
                }
            );
        });
    });

    describe("readSubmission", function () {
        it("should be returning an object represents submission's props", function () {
            return readSubmission(sampleCodeID);
        });
    });

    describe("readAllSubmissions", function () {
        it("should return an array of submissions", function () {
            return readAllSubmissions();
        });
    });

    describe("updateSubmission", function () {
        it("should be updating verdict with a score of 90", function () {
            return updateSubmission(sampleCodeID, sampleVer, 90);
        });
    });

    describe("submitCode", function () {
        it("should be submitting another code", function () {
            return submitCode(sampleCode, sampleID, sampleProb, "OI", null).then(
                id => {
                    sampleCodeID = id;
                },
                err => {
                    throw err;
                }
            );
        });
    });

    describe("updateSubmission", function () {
        it("should be updating verdict with a score of 40", function () {
            return updateSubmission(sampleCodeID, sampleVer, 40);
        });
    });

    describe("updateUser", function () {
        it("should be update user's password", function () {
            return updateUser(sampleID, sampleUser, sampleUser, samplePass, sampleRandom);
        });
    });

    describe("countSatisfy", function () {
        it("should count satisfy submissions", function () {
            return countSatisfy(sampleID, sampleProb);
        });
    });

    describe("lastSatisfy", function () {
        it("should retrieve best satisfy result", function () {
            return lastSatisfy(sampleID, sampleProb, "OI");
        });
    });
});
