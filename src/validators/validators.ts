import Express, { Response, Request, NextFunction, RequestHandler } from 'express'


class ValidationError {
    type: string = "data Validation error"
    field: string
    message: string
    constructor(field: string, msg: string) {
        this.field = field
        this.message = msg
    }


}



class FieldValidator {
    field: string
    validators: RequestHandler[] = []

    constructor(field: string) {
        this.field = field
    }

    getData(req: Request) {
        return req.body[this.field]
    }


    isNull() {

        this.validators.push((req: Request, res: Response, next: NextFunction) => {
            if (this.getData(req) !== null) {
                next()
                return
            }
            return res.status(500).json(new ValidationError(this.field, `${this.field} can't be null`))
        })

        return this

    }


    isEmptyString() {
        this.validators.push(
            (req: Request, res: Response, next: NextFunction) => {
                if (typeof this.getData(req) !== "string") {
                    return res.status(500).json(new ValidationError(this.field, `${this.field} should be a string`))
                }

                if (typeof this.getData(req) === "string" && this.getData(req).length > 0) {
                    next()
                    return
                }
                return res.status(500).json(new ValidationError(this.field, `${this.field} can't be empty`))
            }
        )

        return this
    }

    isNumber() {
        this.validators.push(
            (req: Request, res: Response, next: NextFunction) => {
                if (typeof this.getData(req) === "number") {
                    next()
                    return
                }
                res.status(500).json(new ValidationError(this.field, `${this.field} should be a number`))
            }
        )
        return this
    }

}


export class ValidatorFactory {
    type: string;
    constructor(type: "Body-field" | "param") {
        this.type = type
    }
    createValidator(key: string) {
        if (this.type === 'Body-field') {
            return new FieldValidator(key)
        }
    }

}

