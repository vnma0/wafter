"use strict";

const Console = require("console");
const express = require("express");
const helmet = require("helmet");
const passport = require("passport");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const bodyParser = require("body-parser");
const ip = require("ip");
const expressStaticGzip = require("express-static-gzip");

const server = require("./config/server");
const passportConfig = require("./controller/passportConfig");
const Kon = require("./controller/kon");
// const initJudger = require("./controller/initJudger");
const {
    logToConsole,
    logToFile,
    logErrToConsole
} = require("./middleware/log");

const info = require("./routes/info");
const subs = require("./routes/subs");
const users = require("./routes/users");
const score = require("./routes/score");

/**
 * only use this to start server
 * @returns {Express.server} Server
 */
function startServer() {
    passportConfig(passport);
    // initJudger();
    const app = express();
    initServer(app);
    // API
    setupAPIRoute(app);
    let serv = app
        .listen(server.port, () => {
            Console.log(
                `Wafter is serving at http://${ip.address()}:${server.port}`
            );
        })
        .on("error", () => {
            serv = app.listen(0, () => {
                Console.log(
                    `[Warning] Cannot host on port ${server.port}! Using random port.`
                );
                Console.log(
                    `Wafter is serving at http://${ip.address()}:${
                        serv.address().port
                    }`
                );
            });
        });

    Kon.init(serv);

    return serv;
}

/**
 * Setup API Route for server
 * @param {*} app
 */
function setupAPIRoute(app) {
    app.all("/api", (req, res) => {
        res.sendStatus(204);
    });
    app.use("/api/info", info);
    app.use("/api/subs", subs);
    app.use("/api/users", users);
    app.use("/api/score", score);
    app.post("/api/login", passport.authenticate("local"), (_, res) => {
        res.sendStatus(200);
    });
    app.get("/api/logout", (req, res) => {
        req.logout();
        res.sendStatus(200);
    });
    app.all("/api/*", (req, res) => {
        res.sendStatus(404);
    });
    app.use("/", expressStaticGzip(server.staticFolder));
    app.use("/*", expressStaticGzip(server.staticFolder));
}

/**
 * Pre-load middleware for server
 * @param {*} app
 */
function initServer(app) {
    app.use(helmet());
    app.use(helmet.noCache());
    app.use(
        process.env.NODE_ENV === "production"
            ? [...logToFile(), logErrToConsole]
            : logToConsole
    );
    app.use(bodyParser.urlencoded({ extended: true }));
    const cookieProd = {
        cookie: {
            maxAge: 86400000 // 24h
        },
        store: new MemoryStore({
            checkPeriod: 86400000 // 24h every prune
        })
    };
    const cookieSet = process.env.NODE_ENV === "production" ? cookieProd : {};
    app.use(
        session({
            resave: false,
            saveUninitialized: true,
            secret: server.secret,
            ...cookieSet
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());
}

module.exports = startServer;
