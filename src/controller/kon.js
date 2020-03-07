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
    constructor(ws) {
        this.id = uuidv4();
        this.socket = ws;
        this.queue = [];
    }
}

class Kon {
    constructor() {
        this.isInit = false;
        this.clients = [];
    }

    get hasClient() {
        return this.clients.length !== 0;
    }

    /**
     * Initiate Kon server
     * @param {Server} serv
     */
    init(serv) {
        this.server = new WebSocket.Server({ server: serv, path: "/kon" });
        this.isInit = true;
        this.server.on("connection", (socket, req) => {
            const client = new KonClient(socket);
            this.clients.push(client);
            console.log(`(${client.id})[${req.connection.remoteAddress}] just connected`);

            // TODO: Add human-readable alias

            // TODO: Receive response from konClient
            socket.onmessage = event => {
                try {
                    event.data = JSON.parse(event.data);
                } catch (err) {
                    console.log(`Invalid message from ${client.id}`);
                }
                const sub = event.data;
                console.log(`Received result of ${sub.id} from [${client.id}]`);

                // Verify submission
                const idx = client.queue.indexOf(sub.id);
                if (idx > -1) {
                    client.queue.splice(idx, 1);
                    updateSubmission(
                        sub.id,
                        getBriefVerdict(sub.tests),
                        sub.totalScore,
                        sub.tests
                    ).catch(err =>
                        console.log(`Can't update ${sub.id}: ${err}.`)
                    );
                } else console.log(`Invalid ${sub.id}.`);
                // TODO: store Themis message
            };

            socket.onclose = event => {
                const idx = this.clients.findIndex(val => val.id === client.id);
                this.clients.splice(idx, 1);
                console.log(`[${client.id}] closed connection`);
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
        const select_client = this.clients.sort(
            (x, y) => x.queue.length - y.queue.length
        )[0];
        console.log(`Sending to ${select_client.id}`);
        console.log(sendData);
        select_client.queue.push(sub_id);
        select_client.socket.send(JSON.stringify(sendData));
        return true;
    }
}

module.exports = new Kon();
