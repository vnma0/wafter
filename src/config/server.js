import { existsSync, mkdirSync } from "fs";
import uuidv4 from "uuid/v4";
import { join } from "path";

require("dotenv").config();

const staticFolder = join(__dirname + "/../public");
if (!existsSync(staticFolder)) mkdirSync(staticFolder);

const serverPORT = Number(process.env.PORT);

// TODO: Allow option to be be parsed as parameter in CLI
// i.e: `--port 3002`

export default {
    displayName: process.env.SERVERNAME || "Wafter - Themis Distributed Server",
    port: isNaN(serverPORT) ? 3001 : serverPORT,
    secret: process.env.SECRET || uuidv4(),
    staticFolder: staticFolder
};
