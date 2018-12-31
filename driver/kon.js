import "@babel/polyfill";
import fetch from "node-fetch";
import FormData from "form-data";
import { createReadStream } from "fs";

//Supporting Library for Admin-Judger Interface, MIRAI's backend

// TODO: Make parent class
export default class Judger {
    constructor(serverAddress) {
        this.serverAddress = serverAddress;
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
     * Part 2: cloning Task file to judger
     * @param {string} compressed_task_path : path to database, linked to compressed Task file
     * @return {promise} : true if Task file is successfully cloned, false otherwise
     */
    async clone(compressed_task_path) {
        let task = new FormData();

        task.append("task", createReadStream(compressed_task_path));

        try {
            const response = await fetch(this.serverAddress + "/task", {
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
     * Part 3 : send data to judger
     * @param {string} source_code_path :
     * Path to the database, linked to submission's source code of contestant,
     * @param {String} encrypted_info : Hash of ubmission's info
     * @return {Promise} : true if data is sent successfully, false otherwise
     */
    async send(source_code_path, encrypted_info) {
        let data = new FormData();

        data.append("code", createReadStream(source_code_path));
        data.append("id", encrypted_info);

        try {
            const response = await fetch(this.serverAddress + "/submit", {
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
     * Part 4 : receive result from judger
     * @param {string} serverAddress : IP address of judger
     * @return {json} : result file, consist of verdicts ans hashes
     */
    async get() {
        try {
            const response = await fetch(this.serverAddress + "/get", {
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

    async qLength() {
        try {
            const response = await fetch(this.serverAddress + "/queue", {
                mode: "no-cors",
                cache: "no-cache",
                timeout: 1000
            });
            const text = await response.text();
            if (isNaN(text)) return 0;
            else return Number(text);
        } catch (err) {
            throw err;
        }
    }
}