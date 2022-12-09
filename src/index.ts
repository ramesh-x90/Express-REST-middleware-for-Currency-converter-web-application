import Express, { Response, Request } from 'express'
import cors from 'cors'
import { createClientAsync } from './generated/wsdl/'
import body_parser from 'body-parser'


async function main() {
    const app = Express();
    const soapClient = await createClientAsync('./src/wsdl.wsdl');

    const codeNameCache = await soapClient.getAllCodeAndNamesAsync({});

    app.use(body_parser.json());
    app.use(cors());
    app.use('/docs', Express.static('./dist/docs'));
    app.use('/', Express.static('./dist/ui'));


    app.get('/codeNames', (req, res) => {
        res.json(codeNameCache[0].return);
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


    const port = 4000;
    const s = app.listen(4000);
    console.log(`server address : http://localhost:${port}`);
}
main();
