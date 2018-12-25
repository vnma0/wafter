import { check, send, get } from "../driver/themis";
import fetch from "node-fetch";
import assert from "assert";

const host = "http://localhost:30000";

// fetch(host).then(
//     () => {
//         console.log("No problem");
//     },
//     () => {
//         console.log("Invalid host");
//     }
// );

describe("check", function() {
    it("should return true if judger is available, or false otherwise", function() {
        return check(host + "/check");
    });
});

describe("send", function() {
    it("should return true when sending .cpp ...", function() {
        return send(host + "/submit", "./test/submitcode.cpp", "hash sha-256");
    });
    it("...and return true when sending .pas ...", function() {
        return send(host + "/submit", "./test/submitcode.pas", "hash sha-256");
    });
    it("...and false when sending .js", function() {
        return send(
            host + "/submit",
            "./test/submitcode.txt",
            "hash sha-256"
        ).catch(err => {
            if (err === "Incorrect file type") return Promise.resolve();
            else throw err;
        });
    });
});

describe("get", function() {
    it("should return true when receiving result, or false otherwise", function() {
        // Unknown
        return get(host + "/get").then(result => {
            if (!result) throw "Invalid result";
        });
    });
});
