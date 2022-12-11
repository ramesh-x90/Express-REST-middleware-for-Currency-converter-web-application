import Express, { Response, Request, NextFunction } from 'express'
import cors from 'cors'
import { createClientAsync, Return, WsdlClient } from './generated/wsdl/'
import body_parser from 'body-parser'
import { ValidatorFactory } from './validators/validators'



export interface AppArgs {
    _port: number,
    endPointProtocol: string,
    endPointHost: string,
    endPointPort: number,
    endPointPath: string
}

export class SoapClientError implements Error {
    name: string
    message: string
    stack?: string | undefined
    constructor() {
        this.name = "SoapClientError"
        this.message = "SoapClientError: check application arguments or the network.."
    }

}






export async function App(
    {
        _port,
        endPointProtocol,
        endPointHost,
        endPointPort,
        endPointPath,
    }: AppArgs) {

    const app = Express();


    const endpoint = `${endPointProtocol}://${endPointHost}:${endPointPort}${endPointPath}`


    let soapClient: WsdlClient;
    let codeNameCache: Array<Return>;


    try {
        soapClient = await createClientAsync('./src/wsdl.wsdl', undefined, endpoint);
        codeNameCache = (await soapClient.getAllCodeAndNamesAsync({}))[0].return as Return[];

    } catch (error) {
        throw new SoapClientError()
    }


    app.use(body_parser.json());
    app.use(cors());
    app.use('/docs', Express.static('./dist/docs'));
    app.use('/', Express.static('./dist/ui'));



    const validatorFactory = new ValidatorFactory('Body-field')

    app.get('/codeNames', async (req, res) => {
        res.json(codeNameCache);
    });


    const amountValidator = validatorFactory.createValidator("amount")!.isNull().isNumber().validators
    const sourceCurrencyValidator = validatorFactory.createValidator("sourceCurrency")!.isNull().isEmptyString().validators
    const targetCurrencyValidator = validatorFactory.createValidator("targetCurrency")!.isNull().isEmptyString().validators

    app.post('/convert', amountValidator, sourceCurrencyValidator, targetCurrencyValidator, async (req: Request, res: Response) => {
        const { amount, sourceCurrency, targetCurrency } = req.body;
        try {
            const data = (await soapClient.convertCurrencyAsync({
                amount,
                sourceCurrency,
                targetCurrency
            }))[0].return;
            res.status(200).json(data);
        }
        catch (error) {

            try {
                const str = (error as Error).message;
                const a = str.indexOf('{');
                const b = str.lastIndexOf('}');
                const err = JSON.parse(str.slice(a, b + 1));
                res.status(404).json({ error: err.Exception.message ? err.Exception.message : err });
            } catch (error) {
                res.status(500).json({ error: "Soap Server return a error, failed to parse it.", soapFault: (error as Error).message })
            }


        }
    });



    const s = app.listen(_port);
    console.log(`Express REST API address : http://localhost:${_port}`);

}

