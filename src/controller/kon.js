const { readFileSync } = require("fs");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

const { updateSubmission } = require("./database");
const { getBriefVerdict } = require("../util/parseKon");

class KonClient {
    /**
     *
     * @param {WebSocket} ws Websocket of KonClient
     */
    constructor(ws, ip) {
        this.id = uuidv4();
        this.socket = ws;
        this.queue = new Set();
        this.ip = ip;
    }
}

class Kon {
    constructor() {
        this.isInit = false;
        this.clients = new Set();
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

            // TODO: Add human-readable alias

            // TODO: Extends message platform
            socket.onmessage = (event) => {
                try {
                    event.data = JSON.parse(event.data);
                } catch (err) {
                    console.log(`Invalid message from ${client.id}`);
                }
                const sub = event.data;
                console.log(`Received result of ${sub.id} from [${client.id}]`);

                // Verify submission
                if (client.queue.has(sub.id)) {
                    client.queue.delete(sub.id);
                    updateSubmission(
                        sub.id,
                        getBriefVerdict(sub.tests),
                        sub.totalScore,
                        sub.tests
                    ).catch((err) =>
                        console.log(`Can't update ${sub.id}: ${err}.`)
                    );
                } else console.log(`Invalid ${sub.id}.`);
                // TODO: store Themis message in db
            };

            socket.onclose = (event) => {
                console.log(`[${client.id}] closed connection`);
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
    sendCode(file_path, file_name, sub_id) {
        // TODO: Send message to user when there's no KonClient
        if (!this.hasClient) return false;

        const sendData = {
            id: sub_id,
            name: file_name,
            data: readFileSync(file_path, { encoding: "base64" })
        };
        const select_client = [...this.clients].sort(
            (x, y) => x.queue.size - y.queue.size
        )[0];
        console.log(`Sending to ${select_client.id}`);
        console.log(sendData);
        select_client.queue.add(sub_id);
        select_client.socket.send(JSON.stringify(sendData));
        return true;
    }
}

module.exports = new Kon();
