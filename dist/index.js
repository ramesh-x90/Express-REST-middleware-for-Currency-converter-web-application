"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const args = {
    _port: 4000,
    endPointProtocol: "http",
    endPointHost: "localhost",
    endPointPort: 8080,
    endPointPath: "/ws/currencyConvertService"
};
console.log(args);
(0, app_1.App)(args).catch(e => console.log(e.message));
