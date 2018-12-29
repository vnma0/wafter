import Judger from "../driver/kon";

const judger = new Judger("http://localhost:30000");

describe("check", function() {
    it("should return false when server hasn't been set up", function() {
        return judger.check().then(
            () => {
                throw "Incorrect behaviour";
            },
            (err) => {
                if (err === "Server is not ready") return Promise.resolve();
                else throw err;
            }
        );
    });
});

describe("clone", function() {
    it("should return false when clone wrong file", function() {
        return judger
            .clone("./test/LARES.cpp")
            .then((err) => {
                throw "Incorrect behaviour";
            })
            .catch((err) => {
                if (err === "Incorrect file type") return Promise.resolve();
                else throw err;
            });
    });
    it("...and return true when correctly and successfully cloning Task file to judger ...", function() {
        return judger.clone("./test/Tasks.zip");
    });
});

describe("check", function() {
    it("should return true when server is ready", () => {
        return judger.check("/check");
    });
});

describe("send", function() {
    it("should return true when sending .cpp ...", () => {
        return judger.send("./test/submitcode.cpp", "hash sha-256");
    });
    it("...and return true when sending .pas ...", () => {
        return judger.send("./test/submitcode.pas", "hash sha-256");
    });
    it("...and false when sending .js", () => {
        return judger
            .send("./test/submitcode.txt", "hash sha-256")
            .then((err) => {
                throw "Incorrect behaviour";
            })
            .catch((err) => {
                if (err === "Incorrect file type") return Promise.resolve();
                else throw err;
            });
    });
});

describe("get", function() {
    it("should return true when receiving result, or false otherwise", function() {
        // Unknown
        return judger.get().then((result) => {
            if (!result) throw "Invalid result";
        });
    });
});
