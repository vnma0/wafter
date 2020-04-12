const { readFile } = require("fs");
const { promisify } = require("util");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const CryptoJS = require("crypto-js");

const { updateSubmission } = require("./database");
// const { getBriefVerdict } = require("../util/parseKon");

const readFileAsync = promisify(readFile);

class KonClient {
    /**
     *
     * @param {WebSocket} ws Websocket of KonClient
     * @param {String} ip KonClient IP
     */
    constructor(ws, ip) {
        // TODO: Add human-readable alias
        this.id = uuidv4();
        this.socket = ws;
        this.queue = new Set();
        this.ip = ip;

        // TODO: Extends message platform

        // Init recieve method
        this.socket.onmessage = (event) => {
            try {
                event.data = JSON.parse(event.data);
            } catch (err) {
                console.log(`Invalid message from ${this.id}`);
            }
            const sub = event.data;
            console.log(`Received result of ${sub.id} from [${this.id}]`);

            // Verify submission
            if (this.remove(sub.id)) {
                updateSubmission(
                    sub.id,
                    sub.totalScore,
                    sub.tests,
                    sub.msg
                ).catch((err) =>
                    console.log(`Can't update ${sub.id}: ${err}.`)
                );
            } else console.log(`Invalid ${sub.id}.`);
            // TODO: store Themis message in db
        };
    }

    send({ id, name, data }) {
        this.queue.add(id);
        this.socket.send(JSON.stringify({ id, name, data }));
    }

    remove(id) {
        return this.queue.delete(id);
    }

    get queue_size() {
        return this.queue.size;
    }
}

class Kon {
    constructor() {
        this.isInit = false;
        this.clients = new Set();
        this.key = process.env.konKey || uuidv4();
    }

    get hasClient() {
        return this.clients.size !== 0;
    }

    /**
     * Initiate Kon server
     * @param {Server} serv
     */
    init(serv) {
        this.server = new WebSocket.Server({ server: serv, path: "/kon" });
        this.isInit = true;
        this.server.on("connection", (socket, req) => {
            const client = new KonClient(socket, req.connection.remoteAddress);
            this.clients.add(client);
            console.log(
                `(${client.id})[${req.connection.remoteAddress}] just connected`
            );
            socket.onclose = (event) => {
                console.log(
                    `[${client.id}] closed connection. Code: ${event.reason}. Reason: ${event.reason}`
                );
                this.clients.delete(client);
            };
        });
    }
    /**
     *
     * @param {PathLike} file_path
     * @param {String} file_name
     * @param {String} sub_id
     */
    async sendCode(file_path, file_name, sub_id) {
        // TODO: Send message to user when there's no KonClient
        if (!this.hasClient) return false;

        const encryptMsg = (data, salt) => {
            const key = CryptoJS.PBKDF2(this.key, salt, {
                keySize: 256 / 32,
            });
            return CryptoJS.AES.encrypt(data, key.toString()).toString();
        };

        const data = encryptMsg(
            await readFileAsync(file_path, { encoding: "base64" }),
            sub_id
        );

        const sendData = {
            id: sub_id,
            name: file_name,
            data,
        };
        const select_client = [...this.clients].sort(
            (x, y) => x.queue_size - y.queue_size
        )[0];
        console.log(`Sending ${sendData.id} to ${select_client.id}`);
        select_client.send(sendData);
        return true;
    }
}

module.exports = new Kon();
