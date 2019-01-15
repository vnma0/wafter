import * as db from "../data/database";
import score from "../util/score";
import { GetProblemBestResult } from "../util/result";

const sampleUser = Math.random()
    .toString(36)
    .substr(2, 5);
const samplePass = "samplepassword";
const sampleProb = "sampleprob";
const sampleCode = "samplecode";
let sampleID, sampleCodeID;

const sampleVer = "AC";

describe("database", function() {
    describe("newUser", function() {
        it("should be adding user", function() {
            return db.newUser(sampleUser, samplePass).then(
                (id) => {
                    sampleID = id;
                },
                (err) => {
                    throw err;
                }
            );
        });
        it("should be adding ontest", function() {
            return db.newUser("ontest", samplePass);
        });
    });

    describe("readUser", function() {
        it("should be returning an object represents user's properties", function() {
            return db.readUser(sampleUser);
        });
    });

    describe("readAllUser", function() {
        it("should return an array of users", function() {
            return db.readAllUser();
        });
    });

    describe("readUserPassHash", function() {
        it("should return password hash", function() {
            return db.readUserPassHash(sampleID);
        });
    });

    describe("newSubmission", function() {
        it("should be submitting code", function() {
            return db.newSubmission(sampleCode, sampleID, sampleProb, 96).then(
                (id) => {
                    sampleCodeID = id;
                },
                (err) => {
                    throw err;
                }
            );
        });
    });

    describe("readSubmission", function() {
        it("should be returning an object represents submission's props", function() {
            return db.readSubmission(sampleCodeID);
        });

        it("shouldn't be able to read this", function() {
            return db.readSubmission("sampleCodeID").then(
                () => {
                    throw "it does";
                },
                () => {
                    return;
                }
            );
        });
    });

    describe("readAllSubmissions", function() {
        it("should return an array of submissions", function() {
            return db.readAllSubmissions();
        });
    });

    describe("updateSubmission", function() {
        it("should be updating verdict with a score of 90", function() {
            return db.updateSubmission(sampleCodeID, sampleVer, 90);
        });
    });

    describe("newSubmission", function() {
        it("should be submitting another code", function() {
            return db.newSubmission(sampleCode, sampleID, sampleProb, 101).then(
                (id) => {
                    sampleCodeID = id;
                },
                (err) => {
                    throw err;
                }
            );
        });
    });

    describe("updateSubmission", function() {
        it("should be updating verdict with a score of 40", function() {
            return db.updateSubmission(sampleCodeID, sampleVer, 40);
        });
    });

    describe("updateUser", function() {
        it("should be update user's password", function() {
            return db.updateUser(
                sampleID,
                sampleUser,
                sampleUser,
                samplePass,
                "newpass"
            );
        });

        it("should be able to prevent the collision", function() {
            return db
                .updateUser(
                    sampleID,
                    sampleUser,
                    "ontest",
                    "newpass",
                    samplePass
                )
                .then(
                    () => {
                        throw "it updates to an username which has been used";
                    },
                    () => {
                        return;
                    }
                );
        });
    });

    describe("bestSubmission", function() {
        it("should retrieve best satisfy result", function() {
            return db.bestSubmission(sampleID, sampleProb, score.OI);
        });
    });

    describe("countPreviousSatisfy", function() {
        it("should count to last satisfy result", function() {
            return db.countPreviousSatisfy(sampleCodeID);
        });
    });

    describe("readLastSatisfy", function() {
        it("should count to last satisfy result", function() {
            return db.readLastSatisfy(sampleUser, sampleProb, score.OI);
        });
    });
});

describe("score", function() {
    describe("GetProblemBestResult", function() {
        it("should return best result", function() {
            return GetProblemBestResult(sampleID, sampleProb, score.OI);
        });
    });
});
