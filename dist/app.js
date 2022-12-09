"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const wsdl_1 = require("./generated/wsdl/");
const body_parser_1 = __importDefault(require("body-parser"));
function App({ _port, endPointProtocol, endPointHost, endPointPort, endPointPath, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const endpoint = `${endPointProtocol}://${endPointHost}:${endPointPort}${endPointPath}`;
        console.log(`endpoint address : ${endpoint}`);
        const soapClient = yield (0, wsdl_1.createClientAsync)('./src/wsdl.wsdl', undefined, endpoint);
        const codeNameCache = yield soapClient.getAllCodeAndNamesAsync({});
        app.use(body_parser_1.default.json());
        app.use((0, cors_1.default)());
        app.use('/docs', express_1.default.static('./dist/docs'));
        app.use('/', express_1.default.static('./dist/ui'));
        app.get('/codeNames', (req, res) => {
            res.json(codeNameCache[0].return);
        });
        app.post('/convert', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { amount, sourceCurrency, targetCurrency } = req.body;
            try {
                const data = yield soapClient.convertCurrencyAsync({
                    amount,
                    sourceCurrency,
                    targetCurrency
                });
                res.status(200).json(data[0].return);
            }
            catch (error) {
                const str = error.message;
                const a = str.indexOf('{');
                const b = str.lastIndexOf('}');
                const err = JSON.parse(str.slice(a, b + 1));
                res.status(200);
                res.send({ error: err.Exception.message });
            }
        }));
        const s = app.listen(_port);
        console.log(`Express REST API address : http://localhost:${_port}`);
    });
}
exports.App = App;
