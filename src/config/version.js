module.exports = (() => {
    const meta = require("../../package.json");
    // Get build id on CI/CD
    let build = "Local build";
    if (process.env.APPVEYOR_BUILD_NUMBER) {
        build = "Build " + process.env.APPVEYOR_BUILD_NUMBER;
    }
    return meta && meta.version
        ? meta.version.concat(" - " + build)
        : "Unknown version";
})();
