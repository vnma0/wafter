import zipdir from "zip-dir";
import isZip from "is-zip";
import Console from "console";
import kon from "../config/kon";

/**
 * Zip task folder then send it to Judgers
 */
function initJudger() {
    const arcPath = "Tasks.zip";
    zipdir(kon.tasks, { saveTo: arcPath }, (err, buf) => {
        if (err) throw err;
        if (!isZip(buf)) throw Error("Invalid folder");
        kon.judgers.forEach((judger) => {
            judger
                .clone(arcPath)
                .then((boo) => {
                    if (!boo) throw Error();
                    Console.log(`Sucessfully cloned ${judger.serverAddress}]`);
                })
                .catch(() => {
                    Console.log(`Failed to clone ${judger.serverAddress}`);
                });
        });
    });
}

export default initJudger;
