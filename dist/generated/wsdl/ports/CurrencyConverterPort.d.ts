import { TnsconvertCurrency } from "../definitions/TnsconvertCurrency";
import { TnsconvertCurrencyResponse } from "../definitions/TnsconvertCurrencyResponse";
import { TnsgetAllCodeAndNames } from "../definitions/TnsgetAllCodeAndNames";
import { TnsgetAllCodeAndNamesResponse } from "../definitions/TnsgetAllCodeAndNamesResponse";
export interface CurrencyConverterPort {
    convertCurrency(convertCurrency: TnsconvertCurrency, callback: (err: any, result: TnsconvertCurrencyResponse, rawResponse: any, soapHeader: any, rawRequest: any) => void): void;
    getAllCodeAndNames(getAllCodeAndNames: TnsgetAllCodeAndNames, callback: (err: any, result: TnsgetAllCodeAndNamesResponse, rawResponse: any, soapHeader: any, rawRequest: any) => void): void;
}
