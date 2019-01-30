import Console from "console";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import passport from "passport";
import session from "express-session";
import bodyParser from "body-parser";
import ip from "ip";

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
app.use(helmet.noCache());
app.use(morgan("common"));
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

// API
app.all("/api", (req, res) => {
    res.sendStatus(204);
});
app.use("/api/info", info);
app.use("/api/subs", subs);
app.use("/api/users", users);
app.use("/api/score", score);

app.post("/login", passport.authenticate("local"), (req, res) => {
    res.sendStatus(200);
});

app.get("/logout", (req, res) => {
    req.logout();
    res.sendStatus(200);
});

app.use("/", express.static(server.staticFolder));
// Temp solution ?
app.use("/*", (req, res) => {
    res.sendFile(server.staticFolder + "/index.html");
});

let serv = app.listen(PORT, () => {
    Console.log(`Wafter is serving at ${ip.address()}:${serv.address().port}`);
});
