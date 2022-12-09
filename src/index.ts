import { App, AppArgs } from "./app";



const args: AppArgs = {
    _port: 4000,
    endPointProtocol: "http",
    endPointHost: "localhost",
    endPointPort: 8080,
    endPointPath: "/ws/currencyConvertService"
}



console.log(args)


App(args).catch(
    e => console.log((e as Error).message)
);


