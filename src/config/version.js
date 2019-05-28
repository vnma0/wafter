module.exports = (() => {
    const meta = require("../../package.json");
    return meta && meta.version ? meta.version : "Local build";
})();
