"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClientAsync = void 0;
const soap_1 = require("soap");
/** Create WsdlClient */
function createClientAsync(...args) {
    return (0, soap_1.createClientAsync)(args[0], args[1], args[2]);
}
exports.createClientAsync = createClientAsync;
