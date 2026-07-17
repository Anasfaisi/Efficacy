"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_config_1 = require("@/config/inversify.config");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const socket_io_1 = require("socket.io");
const setUpSocket = (server) => {
    try {
        const io = new socket_io_1.Server(server, {
            cors: {
                origin: process.env.FRONTEND_URL,
                methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                credentials: true,
            },
        });
        const socketController = inversify_config_1.container.get(inversify_key_types_1.TYPES.SocketController);
        socketController.initializeSockets(io);
        return io;
    }
    catch (error) {
        console.log('error from the socket setting up ', error);
    }
};
exports.default = setUpSocket;
//# sourceMappingURL=socket-setup.socket.js.map