import express from "express";
import { subs } from "./routes/subs";
import { users } from "./routes/users";

const app = express();

const PORT = 3000;

app.use("/subs", subs);
app.use("/users", users);

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(PORT, () => {
    console.log(`Wafter is running on port ${PORT}`);
});
