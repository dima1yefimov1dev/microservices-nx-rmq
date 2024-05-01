import { IsEmail, IsString } from 'class-validator';

export namespace AccountRegister {
  export const topic = 'account.register.command';

  export class Request {
    @IsEmail()
    email: string | undefined;

    @IsString()
    password: string | undefined;

    @IsString()
    displayName: string | undefined;
  }

  export class Response {
    email: string | undefined;
  }

}

