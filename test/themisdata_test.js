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

/**
 * some functions will return error since the database is renewed
 * docs will return an object/status
 * 
 */

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
//
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
// no sample ID here
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
// no sample ID here
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
// update that previous sample i made myself
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
