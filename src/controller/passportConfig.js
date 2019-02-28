"use strict";

const {
    readUser,
    readUserByID,
    readUserPassHash
} = require("../data/database");
const { Strategy } = require("passport-local");
const bcrypt = require("bcryptjs");

/**
 * Configure passport to use local Strategy with nedb
 * @param {PassportStatic} passport put require('passport') here
 */
function passportConfig(passport) {
    const local = new Strategy(
        {
            usernameField: "username",
            passwordField: "password"
        },
        async (username, password, done) => {
            try {
                const dbUser = await readUser(username).catch(() => null);
                if (!dbUser)
                    return done(null, false, { message: "Cannot read user" });

                const passHash = await readUserPassHash(dbUser._id);
                const isMatch = await bcrypt.compare(password, passHash);
                if (!isMatch)
                    return done(null, false, { message: "Password mismatch" });

                if (dbUser && isMatch) return done(null, dbUser);
                else return done(null, false, { message: "Unknown error" });
            } catch (err) {
                done(err);
            }
        }
    );

    passport.serializeUser(function(user, cb) {
        cb(null, user._id);
    });

    passport.deserializeUser(function(id, cb) {
        readUserByID(id).then((docs) => cb(null, docs), (err) => cb(err));
    });

    passport.use("local", local);
}

module.exports = passportConfig;
