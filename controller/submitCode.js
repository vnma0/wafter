import zipdir from "zip-dir";
import { Judgers } from "./Judger";
import { submitCode } from "../data/database";
import { reloadSubs } from "./reloadSubs";
import { basename, extname } from "path";

function addJudger(serverAddress) {
    // TODO: Complete this function
}

export function initJudger(task_folder) {
    zipdir(task_folder, { saveTo: "../Tasks.zip" });
    const JudgePromise = Judgers.map((judger) => {
        judger.clone("../Task.zip");
    });
    // TODO: Handle errors
    Promise.all(JudgePromise).catch((err) => {
        throw err;
    });
}

export async function sendCode(source_code_path, user_id, prob_name) {
    try {
        prob_name = prob_name.toUpperCase();
        const prob_id = basename(prob_name, extname(prob_name));
        const sub_id = await submitCode(source_code_path, user_id, prob_id);
        const qPromise = Judgers.map((judger) => judger.qLength());

        const judgersQ = await Promise.all(qPromise);
        const judgerNum = judgersQ
            .map((val, iter) => [val, iter])
            .sort()
            .shift()[1];
        const judger = Judgers[judgerNum];

        judger.send(source_code_path, prob_name, sub_id).catch((err) => {
            throw err;
        });
        // setTimeout(reloadSub(ACM))
    } catch (err) {
        throw err;
    }
}
