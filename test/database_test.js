import {
    newUser,
    readUser,
    submitCode,
    readSubmission,
    updateUser,
    updateSubmission
} from "../data/database";

const sampleUser = "sampleuser";
const samplePass = "samplepassword";
const sampleProb = "sampleprob";
const sampleCode = "samplecode";
const sampleID = "sampleID";
const sampleVer = "sampleverdict";

describe("newUser", function() {
    it("should be adding user", function() {
        return newUser(sampleUser, samplePass);
    });
});

describe("readUser", function() {
    it("should be returning an object represents user's properties", function() {
        return readUser(sampleUser);
    });
});

describe("submitCode", function() {
    it("should be submitting code", function() {
        return submitCode(sampleCode, sampleUser, sampleProb);
    });
});

describe("readSubmission", function() {
    it("should be returning an object represents submission's props", function() {
        return readSubmission(sampleID);
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
