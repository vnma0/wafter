module.exports = (() => {
    const meta = require("../../package.json");
    // Get build id on CI/CD
    let build = process.env.APPVEYOR_BUILD_NUMBER || "";
    if (build) build = " Build " + build;
    return meta && meta.version ? meta.version.concat(build) : "Local build";
})();
