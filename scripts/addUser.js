import readlineSync from "readline-sync";
import { newUser } from "../data/database";

const username = readlineSync.question("Username: ");

const password = readlineSync.questionNewPassword(undefined, {
    min: 8,
    max: 32
});

newUser(username, password);
