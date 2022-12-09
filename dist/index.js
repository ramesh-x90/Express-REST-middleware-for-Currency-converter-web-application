"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cluster_1 = __importDefault(require("node:cluster"));
const node_os_1 = require("node:os");
const node_process_1 = __importDefault(require("node:process"));
const app_1 = require("./app");
const args = {
    _port: 4000,
    endPointProtocol: "http",
    endPointHost: "localhost",
    endPointPort: 8080,
    endPointPath: "/ws/currencyConvertService"
};
const numCPUs = (0, node_os_1.cpus)().length;
if (node_cluster_1.default.isPrimary) {
    console.log({ appArgs: args });
    console.log(`Primary pid: ${node_process_1.default.pid}`);
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        node_cluster_1.default.fork();
    }
    // Redundancy spin a new work in case of failure in a worker
    node_cluster_1.default.on('disconnect', (worker) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log("restarting worker");
        setTimeout(node_cluster_1.default.fork, 5000);
    });
    node_cluster_1.default.on("message", (worker, message, handle) => {
    });
}
else {
    (0, app_1.App)(args).catch(e => {
        node_process_1.default.disconnect();
    });
    console.log(`Worker pid: ${node_process_1.default.pid} started`);
}
