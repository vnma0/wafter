import ExpressBrute from "express-brute";
import ExpressBruteNedbStore from "express-brute-nedb";

const store = new ExpressBruteNedbStore({
    filename: "./brute.db"
});

const bruteForce = new ExpressBrute(store);

export default bruteForce;
