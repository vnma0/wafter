import { readUser } from "../data/database";
import { Strategy } from "passport-local";
import bcrypt from "bcrypt-nodejs";

/**
 * Configure passport to use local Strategy with nedb
 * @param {PassportStatic} passport put require('passport') here
 */
export default function(passport) {
    const local = new Strategy(
        {
            usernameField: "username",
            passwordField: "password"
        },
        (username, password, done) => {
            readUser(username)
                .then((docs) => {
                    // Encrypt password
                    bcrypt.compare(password, docs.pass, (err, isValid) => {
                        if (err) return done(err);
                        if (!isValid) return done(null, false);
                        return done(null, docs);
                    });
                })
                .catch((err) => done(err));
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
