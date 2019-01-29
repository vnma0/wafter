const Console = require("console");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const ip = require("ip");

const server = require("./config/server");
const passportConfig = require("./controller/passportConfig");
const initJudger = require("./controller/initJudger");

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

// TODO: Organize these routes
app.use("/info", info);
app.use("/subs", subs);
app.use("/users", users);
app.use("/score", score);

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
