import {
  newUser,
  readUser,
  submitCode,
  readSubmission,
  updateUser,
  updateSubmission,
  readAllUser,
  readAllSubmissions,
  countToSatisfy,
  readLastSatisfy,
  readSatisfy,
  lastSatisfy
} from "../data/database";

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

const sampleVer = "sampleverdict";

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
      return submitCode(sampleCode, sampleID, sampleProb).then(
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
    it("should be updating verdict", function () {
      return updateSubmission(sampleCodeID, sampleVer);
    });
  });

  describe("updateUser", function () {
    it("should be update user's password", function () {
      return updateUser(sampleID, samplePass, sampleRandom);
    });
  });

  describe("readLastSatisfy", function () {
    it("should retrieve last satisfy result", function () {
      return readLastSatisfy(sampleCodeID);
    });
  });

  describe("readSatisfy", function () {
    it("should get satisfy submissions", function () {
      return readSatisfy(sampleUser, sampleProb);
    });
  });

  describe("lastSatisfy", function () {
    it("should retrieve last satisfy result", function () {
      return readLastSatisfy(sampleUser, sampleProb);
    });
  });
});
