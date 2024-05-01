import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import {IJwtPayload} from 'libs/interfaces/src/index';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET')
    })
  };

  async valdiate({ id }: IJwtPayload) {
    return id;
  }
}
