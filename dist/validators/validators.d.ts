import { Request, RequestHandler } from 'express';
declare class FieldValidator {
    field: string;
    validators: RequestHandler[];
    constructor(field: string);
    getData(req: Request): any;
    isNull(): this;
    isEmptyString(): this;
    isNumber(): this;
}
export declare class ValidatorFactory {
    type: string;
    constructor(type: "Body-field" | "param");
    createValidator(key: string): FieldValidator | undefined;
}
export {};
