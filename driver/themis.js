import "@babel/polyfill";
import fetch from "node-fetch";
import FormData from "form-data";
import { createReadStream } from "fs";

//Supporting Library for Admin-Judger Interface, MIRAI's backend

/**
 * Checking status of availability of judger
 * @param {string} server_address : IP address of judger
 * @return {promise} : true if judger is available, false otherwise
 */

export async function check(server_address) {
    try {
        const response = await fetch(server_address, {
            cache: "no-cache",
            mode: "no-cors",
            timeout: 1000
        });
        const status = response.status;
        if (status === 503) throw "Server is not ready";
        return status === 200;
    } catch (err) {
        throw err;
    }
}

/**
 * Cloning Task file to judger
 * @param {string} server_address : IP address of judger
 * @param {string} compressed_task_path : path to database, linked to compressed Task file
 * @return {promise} : true if Task file is successfully cloned, false otherwise
 */

export async function clone(server_address, compressed_task_path) {
    let task = new FormData();

    task.append("task", createReadStream(compressed_task_path));

    try {
        const response = await fetch(server_address, {
            method: "POST",
            mode: "no-cors",
            body: task,
            timeout: 1000
        });
        const status = response.status;

        if (status === 415) throw "Incorrect file type";
        else if (status == 413) throw "File is too large";
        else if (status == 403) throw "Server has been set up";

        return status === 200;
    } catch (err) {
        throw err;
    }
}

/**
 * Send data to judger
 * @param {string} server_address : IP address of judger
 * @param {string} source_code_path :
 * Path to the database, linked to submission's source code of contestant,
 * @param {String} encrypted_info : Hash of ubmission's info
 * @return {Promise} : true if data is sent successfully, false otherwise
 */

export async function send(server_address, source_code_path, encrypted_info) {
    let data = new FormData();

    data.append("code", createReadStream(source_code_path));
    data.append("id", encrypted_info);

    try {
        const response = await fetch(server_address, {
            method: "POST",
            mode: "no-cors",
            body: data,
            timeout: 1000
        });
        const status = response.status;

        if (status === 415) throw "Incorrect file type";
        else if (status == 413) throw "File is too large";

        return status === 200;
    } catch (err) {
        throw err;
    }
}

/**
 * Receive result from judger
 * @param {string} server_address : IP address of judger
 * @return {json} : result file, consist of verdicts ans hashes
 */
export async function get(server_address) {
    try {
        const response = await fetch(server_address, {
            mode: "no-cors",
            cache: "no-cache",
            timeout: 1000
        });
        const json = await response.json();
        return json;
    } catch (err) {
        throw err;
    }
}
