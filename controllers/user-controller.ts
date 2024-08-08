import { Request, Response, NextFunction } from "express";
import userService from "../service/user-service";
import { validationResult, ValidationError } from "express-validator";
import ApiError from "../exeptions/api-error";

class UserController {
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            const { username, name, password } = req.body;
            if (!errors.isEmpty()) {
                const validationErrors: ValidationError[] = errors.array();
                next(ApiError.BadRequest('Error password length', validationErrors))
            }
            const userData = await userService.registration(username, name, password)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData);
        } catch (err) {
            next(err);
        }
    }
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, password } = req.body;
            const userData = await userService.login(username, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData);
        } catch (err) {
            next(err);
        }
    }
    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (err) {
            next(err);
        }
    }
    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);
            if (!userData) {
                throw new Error('Failed to refresh user data');
            }
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData);
        } catch (err) {
            next(err);
        }
    }
    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users)
        } catch (err) {
            next(err);
        }
    }
}

export default new UserController();