module.exports = (() => {
    const meta = require("../../package.json");
    // Get build id on CI/CD

    // Disable build number until implementation of loose-env
    // let build = process.env.APPVEYOR_BUILD_NUMBER || "";
    // if (build) build = " " + build;
    return meta && meta.version ? meta.version : "Local build";
})();
