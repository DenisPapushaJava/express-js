import { Request, Response, NextFunction, } from "express";
import ApiError from "../exeptions/api-error";
import tokenService from "../service/token-service";
import { JwtPayload } from "jsonwebtoken";

interface Req extends Request {
  user?: string | JwtPayload;
}

export default function (req: Req, res: Response, next: NextFunction) {
  try {
    const authorizationHead = req.headers.authorization;
    if (!authorizationHead) {
      return next(ApiError.UnauthorizedError());
    }
    const accessToken = authorizationHead.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }
    req.user = userData;
    next();

  } catch (err) {
    return next(ApiError.UnauthorizedError());
  }
}