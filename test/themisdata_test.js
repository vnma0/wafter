import { newUser } from "./data/themisdata";

describe("newUser", function () {
    it("should not add new user", function () {
        return newUser('dmcs', 'vnch').then(console.log, console.log);
    });
});