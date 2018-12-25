import "@babel/polyfill";
import fetch from "node-fetch";
import FormData from "form-data";
import { createReadStream } from "fs";

//Supporting Library for Admin-Judger Interface, MIRAI's backend
/**
 * Part 1: checking status of availability of judger
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
        return status === 200;
    } catch (err) {
        throw err;
    }
}

/**
 * Part 2 : send data to judger
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

        return status;
    } catch (err) {
        throw err;
    }
}

/**
 * Part 3 : receive result from judger
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
