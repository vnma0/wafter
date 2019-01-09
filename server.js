import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import passport from "passport";

import session from "express-session";
import bodyParser from "body-parser";

import { subs } from "./routes/subs";
import { users } from "./routes/users";
import { initJudger } from "./controller/submitCode";
import passportConfig from "./controller/passportConfig";
import { auth } from "./middleware/auth";
import server from "./config/server";
import { cwd } from "./config/cwd";
import { join } from "path";
import { info } from "./routes/info";

passportConfig(passport);
const app = express();

const PORT = server.port;

app.use(helmet());
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        resave: false,
        saveUninitialized: true,
        secret: server.secret
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/subs", auth, subs);
app.use("/users", auth, users);
app.get("/info", auth, info);

app.post("/login", passport.authenticate("local"), (req, res) => {
    res.sendStatus(200);
});

app.get("/logout", (req, res) => {
    req.logout();
    res.sendStatus(200);
});

app.get("/kon", auth, (req, res) => {
    try {
        // TODO: Replace with real task
        initJudger(join(cwd, "/test/Tasks.zip"));
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }
});

app.listen(PORT, () => {
    console.log(`Wafter is running on port ${PORT}`);
});
