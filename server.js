import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import passport from "passport";

import session from "express-session";
import bodyParser from "body-parser";

import { subs } from "./routes/subs";
import { users } from "./routes/users";
import passportConfig from "./controller/passportConfig";
import { auth } from "./middleware/auth";

require("dotenv").config();

passportConfig(passport);
const app = express();

const PORT = 3000;

app.use(helmet());
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        resave: false,
        saveUninitialized: true,
        secret:
            process.env.SESSION_SEC ||
            "You must generate a random session secret"
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/subs", auth, subs);
app.use("/users", auth, users);

app.post("/login", passport.authenticate("local"), (req, res) => {
    res.sendStatus(200);
});

app.get("/", auth, (req, res) => {
    res.json(req.body);
});

app.listen(PORT, () => {
    console.log(`Wafter is running on port ${PORT}`);
});
