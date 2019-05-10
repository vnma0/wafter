const { join } = require('path')
const cwd = process.cwd();
const targetFile = join(cwd, 'build/util/version.js');
require('fs').writeFileSync(targetFile, `module.exports = "${
    String(process.env.npm_package_version)
}"`)