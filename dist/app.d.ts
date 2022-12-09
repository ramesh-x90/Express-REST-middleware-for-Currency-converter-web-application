export interface AppArgs {
    _port: number;
    endPointProtocol: string;
    endPointHost: string;
    endPointPort: number;
    endPointPath: string;
}
export declare function App({ _port, endPointProtocol, endPointHost, endPointPort, endPointPath, }: AppArgs): Promise<void>;
