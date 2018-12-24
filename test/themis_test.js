import { check, send, get } from "../driver/themis";
import assert from "assert";

const host = "http://192.168.1.145:30000";

describe("check", function () {
    it("should return true if judger is available, or false otherwise", function () {
        return check(host + "/check");
    });
});

describe("send", function () {
    it("should return true when sending .cpp ...", function () {
        return send(
            host + "/submit",
            "./test/submitcode.cpp",
            "hash sha-256"
        );
    });
    it("...and false when sending .pas", function () {
        return send(
            host + "/submit",
            "./test/submitcode.pas",
            "hash sha-256"
        ).catch(bool => !bool);
    });
});

describe("get", function () {
    it("should return true when receiving result...", function () {
        return get(
            host + "/get"
        )
        .then(result => result.length);
    });
    it("... and false when can't receiving result or receiving nothing", function() {
        return get(
            host + "/get"
        )
        .then(result => !result.length)
        .catch(bool => !bool);
    })
});