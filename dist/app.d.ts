export interface AppArgs {
    _port: number;
    endPointProtocol: string;
    endPointHost: string;
    endPointPort: number;
    endPointPath: string;
}
export declare class SoapClientError implements Error {
    name: string;
    message: string;
    stack?: string | undefined;
    constructor();
}
export declare function App({ _port, endPointProtocol, endPointHost, endPointPort, endPointPath, }: AppArgs): Promise<void>;
