import Console from "console";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import passport from "passport";
import session from "express-session";
import bodyParser from "body-parser";

import server from "./config/server";
import passportConfig from "./controller/passportConfig";
import initJudger from "./controller/initJudger";

import info from "./routes/info";
import subs from "./routes/subs";
import users from "./routes/users";
import score from "./routes/score";

passportConfig(passport);
initJudger();

const app = express();

const PORT = server.port;

app.use(helmet());
app.use(morgan("short"));
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

app.use("/info", info);
app.use("/subs", subs);
app.use("/users", users);
app.use("/score", score);
app.use("/static", express.static(server.staticFolder));

app.post("/login", passport.authenticate("local"), (req, res) => {
    res.sendStatus(200);
});

app.get("/logout", (req, res) => {
    req.logout();
    res.sendStatus(200);
});

let serv = app.listen(PORT, () => {
    Console.log(`Wafter is running on port ${serv.address().port}`);
});
