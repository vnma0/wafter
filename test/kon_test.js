import Judger from "../src/driver/kon";

const judger = new Judger("http://localhost:30000");

describe("kon", function() {
    describe("check", function() {
        it("should return false when server hasn't been set up", function() {
            return judger
                .check()
                .then(() => {
                    throw "Incorrect behaviour";
                })
                .catch((err) => {
                    if (err === "Server is not ready") return Promise.resolve();
                    else throw err;
                });
        });
    });

    describe("clone", function() {
        it("should return false when clone wrong file", function() {
            return judger
                .clone("./test/LARES.cpp")
                .then(() => {
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
        // TODO: Patch with real test using sample.contest
        it("should return true when sending .cpp ...", () => {
            return judger.send(
                "./test/submitcode.cpp",
                "submitcode",
                "hash sha-256"
            );
        });
        it("...and return true when sending .pas ...", () => {
            return judger.send(
                "./test/submitcode.pas",
                "submitcode",
                "hash sha-256"
            );
        });
        it("...and false when sending .txt", () => {
            return judger
                .send("./test/submitcode.txt", "submitcode", "hash sha-256")
                .then(() => {
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
            return judger.get();
        });
    });
});
