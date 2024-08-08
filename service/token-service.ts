import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '../constants';
import { TokenModel } from '../models/token-model';

class TokenService {
  generateTokens(payload: any) {
    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '15d' })
    return {
      accessToken,
      refreshToken
    }
  }

  validateAccessToken(token: string) {
    try {
      const userData = jwt.verify(token, JWT_ACCESS_SECRET);
      return userData;
    } catch (err) {
      return null;
    }
  }
  validateRefreshToken(token: string) {
    try {
      const userData = jwt.verify(token, JWT_REFRESH_SECRET);
      return userData;
    } catch (err) {
      return null;
    }
  }

  async saveToken(userId: any, refreshToken: any) {
    const tokenData = await TokenModel.findOne({ user: userId })
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await TokenModel.create({ user: userId, refreshToken });
    return token;
  }
  async removeToken(refreshToken: string) {
    const tokenData = await TokenModel.deleteOne({ refreshToken });
    return tokenData;
  }
  async findToken(refreshToken: string) {
    const tokenData = await TokenModel.findOne({ refreshToken });
    return tokenData;
  }
}

export default new TokenService();