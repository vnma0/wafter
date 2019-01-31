import path from "path";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import uuidv4 from "uuid/v4";

// DOTENV will be removed soon, don't depend on it
require("dotenv").config();

const staticFolder = path.join(__dirname, "../public");
if (!existsSync(staticFolder)) mkdirSync(staticFolder);
const sampleHTML =
    "<!DOCTYPE html><html><body>Wafter is running as an API server only</body></html>";
if (!existsSync(staticFolder + "/index.html"))
    writeFileSync(staticFolder + "/index.html", sampleHTML);

const serverPORT = Number(process.env.PORT);

// TODO: Allow option to be be parsed as parameter in CLI
// i.e: `--port 3002`

export default {
    displayName: process.env.SERVERNAME || "Wafter - Themis Distributed Server",
    port: isNaN(serverPORT) ? 3001 : serverPORT,
    secret: process.env.SECRET || uuidv4(),
    staticFolder: staticFolder
};
