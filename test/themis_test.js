import { check, send } from "../driver/themis";
import assert from "assert";

describe("check", function() {
    it("should return true if judger is available, or false otherwise", function() {
        return check("http://192.168.100.4:3000/check");
    });
});

describe("send", function() {
    it("should return true when sending .cpp ...", function() {
        return send(
            "http://192.168.100.4:3000/submit",
            "./test/submitcode.cpp",
            "hash sha-256"
        );
    });
    it("...and false when sending .pas", function() {
        return send(
            "http://192.168.100.4:3000/submit",
            "./test/submitcode.pas",
            "hash sha-256"
        ).catch(bool => !bool);
    });
});
