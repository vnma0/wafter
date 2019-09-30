const chalk = require('chalk')
/**
 * @param {string} tag Log message prefix
 * @param {string} fg Foreground color for prefix
 * @param {string} bg Background color for prefix
 */
module.exports = (tag, fg, bg) => (s) => console.log(`${
    chalk.bgGreenBright.black(new Date().toJSON)
} | ${`[${chalk.bgHex(bg).hex(fg)(tag)}]`} ${s}`)