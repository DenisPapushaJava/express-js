import { error } from "console";
import { ValidationError } from "express-validator";

export default class ApiError extends Error {
    status: number;
    errors: ValidationError[];

    constructor(status: number, message: string, errors: ValidationError[] = []) {
        super(message);
        this.status = status;
        this.errors = errors

    }
    static UnauthorizedError() {
        return new ApiError(401, 'user is not authorized', [])
    }
    static BadRequest(message: string, errors: ValidationError[] = []) {
        return new ApiError(400, message, errors);
    }
}