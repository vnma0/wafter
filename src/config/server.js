import { existsSync, mkdirSync } from "fs";
import uuidv4 from "uuid/v4";

require("dotenv").config();

const staticFolder = "front";
if (!existsSync(staticFolder)) mkdirSync(staticFolder);

const serverPORT = Number(process.env.PORT);

export default {
    displayName: process.env.SERVERNAME || "Wafter - Themis Distributed Server",
    port: isNaN(serverPORT) ? 3000 : serverPORT,
    secret: process.env.SECRET || uuidv4(),
    staticFolder: staticFolder
};
