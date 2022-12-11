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
exports.App = exports.SoapClientError = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const wsdl_1 = require("./generated/wsdl/");
const body_parser_1 = __importDefault(require("body-parser"));
const validators_1 = require("./validators/validators");
class SoapClientError {
    constructor() {
        this.name = "SoapClientError";
        this.message = "SoapClientError: check application arguments or the network..";
    }
}
exports.SoapClientError = SoapClientError;
function App({ _port, endPointProtocol, endPointHost, endPointPort, endPointPath, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const endpoint = `${endPointProtocol}://${endPointHost}:${endPointPort}${endPointPath}`;
        let soapClient;
        let codeNameCache;
        try {
            soapClient = yield (0, wsdl_1.createClientAsync)('./src/wsdl.wsdl', undefined, endpoint);
            codeNameCache = (yield soapClient.getAllCodeAndNamesAsync({}))[0].return;
        }
        catch (error) {
            throw new SoapClientError();
        }
        app.use(body_parser_1.default.json());
        app.use((0, cors_1.default)());
        app.use('/docs', express_1.default.static('./dist/docs'));
        app.use('/', express_1.default.static('./dist/ui'));
        const validatorFactory = new validators_1.ValidatorFactory('Body-field');
        app.get('/codeNames', (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.json(codeNameCache);
        }));
        const amountValidator = validatorFactory.createValidator("amount").isNull().isNumber().validators;
        const sourceCurrencyValidator = validatorFactory.createValidator("sourceCurrency").isNull().isEmptyString().validators;
        const targetCurrencyValidator = validatorFactory.createValidator("targetCurrency").isNull().isEmptyString().validators;
        app.post('/convert', amountValidator, sourceCurrencyValidator, targetCurrencyValidator, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { amount, sourceCurrency, targetCurrency } = req.body;
            try {
                const data = (yield soapClient.convertCurrencyAsync({
                    amount,
                    sourceCurrency,
                    targetCurrency
                }))[0].return;
                res.status(200).json(data);
            }
            catch (error) {
                try {
                    const str = error.message;
                    const a = str.indexOf('{');
                    const b = str.lastIndexOf('}');
                    const err = JSON.parse(str.slice(a, b + 1));
                    res.status(404).json({ error: err.Exception.message ? err.Exception.message : err });
                }
                catch (error) {
                    res.status(500).json({ error: "Soap Server return a error, failed to parse it.", soapFault: error.message });
                }
            }
        }));
        const s = app.listen(_port);
        console.log(`Express REST API address : http://localhost:${_port}`);
    });
}
exports.App = App;
