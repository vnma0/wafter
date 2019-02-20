import { existsSync, mkdirSync } from "fs";

import KonConfig from "../util/config/readKonConfig";

const konListFile = "kon.json";

// Require valid folder to work
const taskFolder = "Tasks";

if (!existsSync(konListFile)) mkdirSync(taskFolder);

export default {
    judgers: KonConfig(konListFile),
    tasks: taskFolder
};
