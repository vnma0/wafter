import {
    newUser,
    readUser,
    submitCode,
    readSubmission,
    updateUser,
    updateSubmission,
    readAllUser,
    readAllSubmissions,
    bestSubmission,
    countToSatisfy,
    readLastSatisfy
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

    describe("newUser", function () {
        it("should be adding ontest", function () {
            return newUser("ontest", samplePass);
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

    describe("readSubmission", function () {
        it("shouldn't be able to read this", function () {
            return readSubmission("sampleCodeID").then(
                () => {
                    throw "it does";
                },
                () => {
                    return;
                }
            );
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
            return updateUser(sampleID, sampleUser, sampleUser, samplePass, "newpass");
        });
    });

    describe("updateUser", function () {
        it("should be able to prevent the collision", function () {
            return updateUser(sampleID, sampleUser, "ontest", "newpass", samplePass)
                .then(
                    () => {
                        throw "it updates to an username which has been used";
                    },
                    () => {
                        return;
                    }
                )
        });
    });

    describe("bestSubmission", function () {
        it("should retrieve best satisfy result", function () {
            return bestSubmission(sampleID, sampleProb, "OI");
        });
    });

    describe("countToSatisfy", function () {
        it("should count to last satisfy result", function () {
            return countToSatisfy(sampleCodeID);
        });
    });

    describe("readLastSatisfy", function () {
        it("should count to last satisfy result", function () {
            return readLastSatisfy(sampleUser, sampleProb, "OI");
        });
    });

});
