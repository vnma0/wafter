module.exports = (() => {
    const meta = require("../../package.json");
    // Get build id on CI/CD
    let ci_build = process.env.APPVEYOR_BUILD_NUMBER;
    
    // Set build id = CI build else local id
    let build = ci_build || "local";

    // Set version string
    let version = meta && meta.version
        ? meta.version.concat("+" + build)
        : "undef";
    process.versions.wafter = version;

    return version;
})();
