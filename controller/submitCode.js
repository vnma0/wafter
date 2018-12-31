import zipdir from "zip-dir";
import { Judgers } from "./Judger";
function addJudger(serverAddress) {
    // TODO: Complete this function
}

export function initJudger(task_folder) {
    zipdir(task_folder, { saveTo: "../Tasks.zip" });
    const JudgePromise = Judgers.map((judger) => {
        judger.clone("../Task.zip");
    });
    // TODO: Handle errors
    Promise.all(JudgePromise)
        .then(console.log)
        .catch(console.log);
}

export function sendCode(source_code_path, id) {
    const JudgePromise = Judgers.map((judger) => {
        judger.qLength();
    });
    Promise.all(JudgePromise)
        .then((val) => val.sort().shift())
        .then((judger) => {
            judger.send(source_code_path, id).catch((err) => {
                throw err;
            });
        })
        .catch(console.log);
}
