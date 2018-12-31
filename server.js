import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import passport from "passport";

import session from "express-session";
import bodyParser from "body-parser";

import { readUser, readUserByID } from "./data/database";
import { Strategy } from "passport-local";
import bcrypt from "bcrypt-nodejs";

import { subs } from "./routes/subs";
import { users } from "./routes/users";
import { auth } from "./middleware/auth";

const app = express();

const PORT = 3000;

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

app.use(helmet());
app.use(morgan("tiny"));
app.use(bodyParser());
app.use(session({ secret: "keyboard cat" }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/subs", auth, subs);
app.use("/users", auth, users);
app.get("/success", (req, res) => res.send("Welcome !!"));
app.get("/error", (req, res) => res.send("error logging in"));

app.post("/login", passport.authenticate("local"), (req, res) => {
    res.sendStatus(200);
});

app.get("/", auth, (req, res) => {
    res.json(req.body);
});

app.listen(PORT, () => {
    console.log(`Wafter is running on port ${PORT}`);
});
