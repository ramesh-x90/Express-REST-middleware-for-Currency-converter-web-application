import { TnsgetAllCodeAndNames } from "../definitions/TnsgetAllCodeAndNames";
import { TnsgetAllCodeAndNamesResponse } from "../definitions/TnsgetAllCodeAndNamesResponse";
import { TnsconvertCurrency } from "../definitions/TnsconvertCurrency";
import { TnsconvertCurrencyResponse } from "../definitions/TnsconvertCurrencyResponse";
export interface CurrencyConverterPort {
    getAllCodeAndNames(getAllCodeAndNames: TnsgetAllCodeAndNames, callback: (err: any, result: TnsgetAllCodeAndNamesResponse, rawResponse: any, soapHeader: any, rawRequest: any) => void): void;
    convertCurrency(convertCurrency: TnsconvertCurrency, callback: (err: any, result: TnsconvertCurrencyResponse, rawResponse: any, soapHeader: any, rawRequest: any) => void): void;
}
