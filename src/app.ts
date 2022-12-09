import Express, { Response, Request } from 'express'
import cors from 'cors'
import { createClientAsync, Return, WsdlClient } from './generated/wsdl/'
import body_parser from 'body-parser'



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

    app.get('/codeNames', async (req, res) => {
        res.json(codeNameCache);
    });

    app.post('/convert', async (req: Request, res: Response) => {
        const { amount, sourceCurrency, targetCurrency } = req.body;
        try {
            const data = await soapClient.convertCurrencyAsync({
                amount,
                sourceCurrency,
                targetCurrency
            });
            res.status(200).json(data[0].return);
        }
        catch (error) {
            const str = (error as Error).message;
            const a = str.indexOf('{');
            const b = str.lastIndexOf('}');
            const err = JSON.parse(str.slice(a, b + 1));
            res.status(200);
            res.send({ error: err.Exception.message });
        }
    });



    const s = app.listen(_port);
    console.log(`Express REST API address : http://localhost:${_port}`);

}

