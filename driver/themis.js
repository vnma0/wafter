import fetch from "node-fetch";
import { timeout, TimeoutError } from "promise-timeout";
import FormData from "form-data";
import { createReadStream } from "fs";

//Supporting Library for Admin-Judger Interface, MIRAI's backend
/**
 * Part 1: checking status of availability of judger
 * @param {string} server_address : IP address of judger
 * @return {promise} : true if judger is available, false otherwise
 */

export function check(server_address) {
    return timeout(
        fetch(server_address, {
            cache: "no-cache",
            mode: "no-cors"
        }),
        1000
    )
        .then(response => response.status)
        .then(status => status === 200)
        .catch(err => {
            if (err instanceof TimeoutError) {
                return Promise.reject("Timeout error!");
            }
        });
}

/**
 * Part 2 : send data to judger
 * @param {string} server_address : IP address of judger
 * @param {string} source_code_path :
 * Path to the database, linked to submission's source code of contestant,
 * @param {string} encrypted_info : Hash of ubmission's info
 * @return {promise} : true if data is sent successfully, false otherwise
 */

export function send(server_address, source_code_path, encrypted_info) {
    let data = new FormData();
    
    data.append("code", createReadStream(source_code_path));
    data.append("id", encrypted_info);

    return fetch(server_address, {
        method: "POST",
        mode: "no-cors",
        body: data
    })
        .then(response => response.json())
        .then(response =>
            console.log("Successful attempt of data transfering to judge")
        )
        .catch(error =>
            Promise.reject("Unsuccesful attempt of data transfering to judger")
        );
}

/**
 * Part 3 : receive result from judger
 * @param {string} server_address : IP address of judger
 * @return {text} : result file, consist of verdicts ans hashes
 */
export function get(server_address) {
    return fetch(server_address, {
        mode: "no-cors",
        cache: "no-cache"
    })
        .then(response => response.text())
        .catch(error =>
            Promise.reject("Unsuccesful attempt of data receiving from judger")
        );
}