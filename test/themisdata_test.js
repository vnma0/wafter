import { newUser, readUser ,submitCode, readSubmission,updateUser,updateSubmission} from "../data/themisdata";
// i made one myself
describe("newUser", function() {
  it("should be adding user", function() {
    return newUser("yourgramp", "yeeted").then(
      () => {
        return Promise.resolve();
      },
      err => {
        if (err == "user created") return Promise.resolve();
        else throw err;
      }
    );
  });
});
// 
describe("readUser", function() {
  it("should be returning an object represents user's properties", function() {
    return readUser("yourgramp").then(
      () => {
        //console.log;
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
      return submitCode("coded","yourgramp", "prob").then(
        () => {
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
      return readSubmission("ID").then(
        () => {
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
      return updateSubmission("ID","yeeted").then(
        () => {
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
      return updateUser("yourgramp","yeeted","bigyeet").then(
        () => {
          return Promise.resolve();
        },
        err => {
          throw err;
        }
      );
    });
});