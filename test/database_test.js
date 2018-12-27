import {
  newUser,
  readUser,
  submitCode,
  readSubmission,
  updateUser,
  updateSubmission
} from "../data/themisdata";

const sampleUser = "sampleuser";
const samplePass = "samplepassword";
const sampleProb = "sampleprob";
const sampleCode = "samplecode";
const sampleID = "sampleID";
const sampleVer = "sampleverdict";

describe("newUser", function() {
  it("should be adding user", function() {
    return newUser(sampleUser, samplePass).then(
      docs => {
        return Promise.resolve();
      },
      err => {
        throw err;
      }
    );
  });
});

describe("readUser", function() {
  it("should be returning an object represents user's properties", function() {
    return readUser(sampleUser).then(
      docs => {
        return Promise.resolve();
      },
      err => {
        throw err;
      }
    );
  });
});

describe("submitCode", function() {
  it("should be submitting code", function() {
    return submitCode(sampleCode, sampleUser, sampleProb).then(
      docs => {
        return Promise.resolve();
      },
      err => {
        if (err == "submitted") return Promise.resolve();
        else throw err;
      }
    );
  });
});

describe("readSubmission", function() {
  it("should be returning an object represents submission's props", function() {
    return readSubmission(sampleID).then(
      docs => {
        return Promise.resolve();
      },
      err => {
        throw err;
      }
    );
  });
});

describe("updateSubmission", function() {
  it("should be updating verdict", function() {
    return updateSubmission(sampleID, sampleVer).then(
      docs => {
        return Promise.resolve();
      },
      err => {
        throw err;
      }
    );
  });
});

describe("updateUser", function() {
  it("should be update user's password", function() {
    return updateUser(sampleUser, samplePass, samplePass).then(
      docs => {
        return Promise.resolve();
      },
      err => {
        throw err;
      }
    );
  });
});
