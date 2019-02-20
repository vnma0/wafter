import path from "path";
import { existsSync, mkdirSync, writeFileSync } from "fs";

import serverConfig from "../util/config/readServerConfig";

const staticFolder = path.join(__dirname, "../public");
if (!existsSync(staticFolder)) mkdirSync(staticFolder);
const sampleHTML =
    "<!DOCTYPE html><html><body>Wafter is running as an API server only</body></html>";
if (!existsSync(staticFolder + "/index.html"))
    writeFileSync(staticFolder + "/index.html", sampleHTML);

const serverCfg = Object.assign(serverConfig(), { staticFolder: staticFolder });

export default serverCfg;
