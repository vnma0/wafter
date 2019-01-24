import fetch from "node-fetch";
import FormData from "form-data";
import { createReadStream } from "fs";

//Supporting Library for Admin-Judger Interface, MIRAI's backend

// TODO: Make parent class
export default class Judger {
    constructor(server_address, prob_list) {
        this.serverAddress = server_address;
        this.probList = prob_list;
    }
    /**
     * Part 1: checking status of availability of judger
     * @return {promise} : true if judger is available, false otherwise
     */
    async check() {
        try {
            const response = await fetch(this.serverAddress + "/check", {
                cache: "no-cache",
                mode: "no-cors",
                timeout: 1000,
                compress: true
            });
            const status = response.status;
            if (status === 200) return true;
            else if (status === 503) return false;
            else throw `${this.serverAddress} has inappropriate return.`;
        } catch (err) {
            if (err.name === "FetchError") return undefined;
            else throw err;
        }
    }

    /**
     * Part 2: cloning Task file to judger
     * @param {string} compressed_task_path : path to database, linked to compressed Task file
     * @return {promise} : true if Task file is successfully cloned, false otherwise
     */
    async clone(compressed_task_path) {
        let task = new FormData();

        const zip = createReadStream(compressed_task_path);
        task.append("task", zip);

        try {
            const response = await fetch(this.serverAddress + "/task", {
                method: "POST",
                body: task,
                timeout: 10000,
                compress: true
            });
            const status = response.status;

            if (status === 415) throw "Incorrect file type";
            else if (status === 413) throw "File is too large";
            else if (status === 403) throw "Server has been set up";

            return status === 200;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Part 3 : send data to judger
     * @param {string} source_code_path :
     * Path to the database, linked to submission's source code of contestant,
     * @param {string} prob_name Filename
     * @param {String} encrypted_info : Hash of ubmission's info
     * @return {Promise} : true if data is sent successfully, false otherwise
     */
    async send(source_code_path, prob_name, encrypted_info) {
        let data = new FormData();

        if (!source_code_path || !prob_name || !encrypted_info)
            throw new Error("Invalid data");

        data.append("code", createReadStream(source_code_path), prob_name);
        data.append("id", encrypted_info);

        try {
            const response = await fetch(this.serverAddress + "/submit", {
                method: "POST",
                mode: "no-cors",
                body: data,
                timeout: 5000,
                compress: true
            });
            const status = response.status;

            if (status === 415) throw "Incorrect file type";
            else if (status === 413) throw "File is too large";
            else if (status === 503) throw "Server is not ready";
            else if (status === 400) throw "Bad request";

            return status === 200;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Part 4 : receive result from judger
     * @param {string} serverAddress : IP address of judger
     * @return {json} : result file, consist of verdicts ans hashes
     */
    async get() {
        try {
            const response = await fetch(this.serverAddress + "/get", {
                mode: "no-cors",
                cache: "no-cache",
                timeout: 5000,
                compress: true
            });
            if (response.status === 503) throw "Server is not ready";
            const json = response.status === 200 ? await response.json() : [];
            return json;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Receive queue length from judger
     */
    async qLength() {
        try {
            const response = await fetch(this.serverAddress + "/queue", {
                mode: "no-cors",
                cache: "no-cache",
                timeout: 1000,
                compress: true
            });
            const text = await response.text();
            return Number(text);
        } catch (err) {
            if (err.name === "FetchError") return undefined;
            else throw err;
        }
    }
}
