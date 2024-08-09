import { UsersModel } from "../models/user-model";
import bcrypt from "bcrypt";
import tokenService from "./token-service";
import UserDto from "../dtos/user-dto";
import ApiError from "../exeptions/api-error";

class UserService {
    async registration(username: string, name: string, password: string) {
        const candidate = await UsersModel.findOne({ username });
        if (candidate) {
            throw ApiError.BadRequest(`User ${username} already exists`)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const user = await UsersModel.create({ username, name, password: hashPassword });
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }
    async login(username: string, password: string) {
        const user = await UsersModel.findOne({ username });
        if (!user) {
            throw ApiError.BadRequest(`User ${username} does not exist`)
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest(`Incorrect password`)
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }

    }
    async logout(refreshToken: string) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }
    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        };
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const userId = typeof userData === 'string' ? userData : userData.id;
        const user = await UsersModel.findById(userId)
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }
    async getAllUsers() {
        const users = await UsersModel.find();
        return users;
    }
}

export default new UserService();