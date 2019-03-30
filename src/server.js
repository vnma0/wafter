"use strict";

const Console = require("console");
const express = require("express");
const helmet = require("helmet");
const passport = require("passport");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const bodyParser = require("body-parser");
const ip = require("ip");

const server = require("./config/server");
const passportConfig = require("./controller/passportConfig");
const initJudger = require("./controller/initJudger");
const { logToConsole, logToFile } = require("./middleware/log");

const info = require("./routes/info");
const subs = require("./routes/subs");
const users = require("./routes/users");
const score = require("./routes/score");

passportConfig(passport);
initJudger();

const app = express();

const PORT = server.port;

app.use(helmet());
app.use(helmet.noCache());
app.use(logToConsole);
app.use(logToFile);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 86400000 // 24h
        },
        store: new MemoryStore({
            checkPeriod: 86400000 // 24h every prune
        }),
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

app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.sendStatus(200);
});

app.get("/api/logout", (req, res) => {
    req.logout();
    res.sendStatus(200);
});

app.all("/api/*", (req, res) => {
    res.sendStatus(404);
});

app.use("/", express.static(server.staticFolder));
// Temp solution ?
app.use("/*", (req, res) => {
    res.sendFile(server.staticFolder + "/index.html");
});

let serv = app.listen(PORT, () => {
    Console.log(
        `Wafter is serving at http://${ip.address()}:${serv.address().port}`
    );
});
process.on("exit", () => {
    serv.close(() => {
        Console.log("Closing server");
        process.exit(0);
    });
});
