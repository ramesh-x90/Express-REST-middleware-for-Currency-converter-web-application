"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatorFactory = void 0;
class ValidationError {
    constructor(field, msg) {
        this.type = "data Validation error";
        this.field = field;
        this.message = msg;
    }
}
class FieldValidator {
    constructor(field) {
        this.validators = [];
        this.field = field;
    }
    getData(req) {
        return req.body[this.field];
    }
    isNull() {
        this.validators.push((req, res, next) => {
            if (this.getData(req)) {
                next();
                return;
            }
            return res.status(500).json(new ValidationError(this.field, `${this.field} can't be null`));
        });
        return this;
    }
    isEmptyString() {
        this.validators.push((req, res, next) => {
            if (typeof this.getData(req) !== "string") {
                return res.status(500).json(new ValidationError(this.field, `${this.field} should be a string`));
            }
            if (typeof this.getData(req) === "string" && this.getData(req).length > 0) {
                next();
                return;
            }
            return res.status(500).json(new ValidationError(this.field, `${this.field} can't be empty`));
        });
        return this;
    }
    isNumber() {
        this.validators.push((req, res, next) => {
            if (typeof this.getData(req) === "number") {
                next();
                return;
            }
            res.status(500).json(new ValidationError(this.field, `${this.field} should be a number`));
        });
        return this;
    }
}
class ValidatorFactory {
    constructor(type) {
        this.type = type;
    }
    createValidator(key) {
        if (this.type === 'Body-field') {
            return new FieldValidator(key);
        }
    }
}
exports.ValidatorFactory = ValidatorFactory;
