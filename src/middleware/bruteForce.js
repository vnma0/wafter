const ExpressBrute = require("express-brute");
const ExpressBruteNedbStore = require("express-brute-nedb");

const store = new ExpressBruteNedbStore({
    filename: "brute.db"
});

const bruteForce = new ExpressBrute(store);

module.exports = bruteForce;
