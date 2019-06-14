"use strict";

const cwd = require("./cwd");
const { join } = require("path");
const { existsSync } = require("fs");

const local_folder = join(cwd, "local");

// TODO: Add any file/folder using symlink
module.exports = {
    active: existsSync(local_folder),
    folder: existsSync(local_folder) ? local_folder : undefined
};
