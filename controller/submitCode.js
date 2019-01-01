import zipdir from "zip-dir";
import { Judgers } from "./Judger";
import { submitCode } from "../data/database";
import { reloadSubs } from "./reloadSubs";
import { basename, extname } from "path";

/**
 * Qualify and add new server to Judgers
 * @param {String} serverAddress Exepected address of kon server
 */
export async function addJudger(serverAddress) {
    // TODO: Pair with singleton Judgers
}

/**
 * Send zipped task file to Judgers
 * @param {PathLike} task_folder path to folder contains task file
 */
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

/**
 * Add submission to database then send part of it to Judger
 * @param {PathLike} source_code_path Path to source code
 * @param {String} user_id User's ID
 * @param {String} prob_name file's name
 */
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
