// const { Select } = require("enquirer");
const Console = require("console");

require("./util/config/contestConfig").genIfNotExist();
// require("./util/config/KonConfig").genIfNotExist();
const VERSION = require("./config/version");

// const addUser = require("./prompt/addUser");
// const contestOptions = require("./prompt/contestOptions");
// const KonOptions = require("./prompt/KonOptions");
const server = require("./server");

// const mainChoices = {
//     "Contest options": contestOptions,
//     "Kon's pair options": KonOptions
// };

/**
 * Main prompt
 */
// const mainPrompt = new Select({
//     name: "main",
//     message: "How can I help you ?",
//     choices: ["Start server", ...Object.keys(mainChoices), "Version", "Exit"]
// });

/**
 * Main menu
 */
function main() {
    process.title = "MIRAI Wafter " + VERSION;
    Console.log("MIRAI Wafter " + VERSION);
    Console.log("Copyright (c) 2018-2020 Vườn ươm A0. MIT License.");
    Console.log({
        wafter: process.versions.wafter,
        node: process.versions.node,
        v8: process.versions.v8,
        platform: process.platform,
        arch: process.arch
    });
    server();
    // mainPrompt
    //     .run()
    //     .then((res) => {
    //         if (res === "Start server") {
                
    //         } else if (res === "Version") {
    //             Console.log({
    //                 wafter: process.versions.wafter,
    //                 node: process.versions.node,
    //                 v8: process.versions.v8,
    //                 platform: process.platform,
    //                 arch: process.arch
    //             });
    //         } else if (Reflect.has(mainChoices, res)) {
    //             Reflect.apply(mainChoices[res], null, []).catch((err) => {
    //                 Console.log(
    //                     `Exited to menu${err.message ? `: ${err.message}` : ""}`
    //                 );
    //             });
    //         }
    //     })
    //     .catch(console.error);
}

main();
