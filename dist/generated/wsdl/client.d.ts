import { Client as SoapClient, createClientAsync as soapCreateClientAsync } from "soap";
import { TnsconvertCurrency } from "./definitions/TnsconvertCurrency";
import { TnsconvertCurrencyResponse } from "./definitions/TnsconvertCurrencyResponse";
import { TnsgetAllCodeAndNames } from "./definitions/TnsgetAllCodeAndNames";
import { TnsgetAllCodeAndNamesResponse } from "./definitions/TnsgetAllCodeAndNamesResponse";
import { CurrencyConverterSoap } from "./services/CurrencyConverterSoap";
export interface WsdlClient extends SoapClient {
    CurrencyConverterSoap: CurrencyConverterSoap;
    convertCurrencyAsync(convertCurrency: TnsconvertCurrency): Promise<[result: TnsconvertCurrencyResponse, rawResponse: any, soapHeader: any, rawRequest: any]>;
    getAllCodeAndNamesAsync(getAllCodeAndNames: TnsgetAllCodeAndNames): Promise<[result: TnsgetAllCodeAndNamesResponse, rawResponse: any, soapHeader: any, rawRequest: any]>;
}
/** Create WsdlClient */
export declare function createClientAsync(...args: Parameters<typeof soapCreateClientAsync>): Promise<WsdlClient>;
