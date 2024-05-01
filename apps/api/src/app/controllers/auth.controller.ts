import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import {AccountLogin, AccountRegister} from 'libs/contracts/src/index';
import { RMQService } from 'nestjs-rmq';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly rmqService: RMQService,
  ) {}

  @Post('register')
  async registration(@Body() input: RegisterDto)  {
    try {
      return await this.rmqService.send<AccountRegister.Request, AccountRegister.Response>(AccountRegister.topic, input);
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message)
      }
    }
  }

  @Post('login')
  async login(@Body() input: LoginDto) {
    try {
      return await this.rmqService.send<AccountLogin.Request, AccountLogin.Response>(AccountLogin.topic, input);
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message)
      }
    }
  }
}
