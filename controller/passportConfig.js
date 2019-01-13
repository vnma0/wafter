import { readUser, readUserByID, readUserPassHash } from "../data/database";
import { Strategy } from "passport-local";
import bcrypt from "bcryptjs";

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
        async (username, password, done) => {
            try {
                const dbUser = await readUser(username);
                const passHash = await readUserPassHash(dbUser._id);
                const isMatch = await bcrypt.compare(password, passHash);
                if (isMatch) return done(null, dbUser);
                else done(null, false);
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
