/**
 *
 * @param {WebSocket.Server} konServer
 */
function konSetup(konServer) {
    konServer.on("connection", (ws, req) => {
        ws.onmessage = () => {
            ws.send(
                `Received connection from [${req.connection.remoteAddress}]`
            );
        };
    });
}

module.exports = konSetup;
