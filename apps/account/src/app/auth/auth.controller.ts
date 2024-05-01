import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import {AccountLogin, AccountRegister} from 'libs/contracts/src';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @RMQValidate()
  @RMQRoute(AccountRegister.topic)
  async registration(@Body() dto: AccountRegister.Request) : Promise<AccountRegister.Response> {
    return this.authService.registration(dto)
  }

  @RMQValidate()
  @RMQRoute(AccountLogin.topic)
  async login(@Body() {email, password}: AccountLogin.Request): Promise<AccountLogin.Response> {
    const { id } = await this.authService.validateUser(email, password);
    return this.authService.login(id);
  }
}
