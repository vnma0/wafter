const { readFileSync } = require("fs");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

class KonClient {
    /**
     *
     * @param {WebSocket} ws Websocket of KonClient
     */
    constructor(ws) {
        this.id = uuidv4();
        this.socket = ws;
    }
}

class Kon {
    isInit = false;
    clients = [];

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
            console.log(`[${client.id}] just connected`);

            // TODO: Add human-readable alias

            // TODO: Receive response from konClient
            // ws.onmessage()

            socket.onclose = event => {
                const idx = this.clients.findIndex(val => val.id === client.id);
                this.clients.splice(idx);
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
        if (!this.hasClient) return false;

        const sendData = {
            id: sub_id,
            name: file_name,
            data: readFileSync(file_path, { encoding: "base64" })
        };
        console.log(sendData);
        this.clients[0].socket.send(JSON.stringify(sendData));
        return true;
    }
}

module.exports = new Kon();
