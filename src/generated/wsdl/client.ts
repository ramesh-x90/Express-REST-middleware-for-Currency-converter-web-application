import { Client as SoapClient, createClientAsync as soapCreateClientAsync } from "soap";
import { TnsgetAllCodeAndNames } from "./definitions/TnsgetAllCodeAndNames";
import { TnsgetAllCodeAndNamesResponse } from "./definitions/TnsgetAllCodeAndNamesResponse";
import { TnsconvertCurrency } from "./definitions/TnsconvertCurrency";
import { TnsconvertCurrencyResponse } from "./definitions/TnsconvertCurrencyResponse";
import { CurrencyConverterSoap } from "./services/CurrencyConverterSoap";

export interface WsdlClient extends SoapClient {
    CurrencyConverterSoap: CurrencyConverterSoap;
    getAllCodeAndNamesAsync(getAllCodeAndNames: TnsgetAllCodeAndNames): Promise<[result: TnsgetAllCodeAndNamesResponse, rawResponse: any, soapHeader: any, rawRequest: any]>;
    convertCurrencyAsync(convertCurrency: TnsconvertCurrency): Promise<[result: TnsconvertCurrencyResponse, rawResponse: any, soapHeader: any, rawRequest: any]>;
}

/** Create WsdlClient */
export function createClientAsync(...args: Parameters<typeof soapCreateClientAsync>): Promise<WsdlClient> {
    return soapCreateClientAsync(args[0], args[1], args[2]) as any;
}
