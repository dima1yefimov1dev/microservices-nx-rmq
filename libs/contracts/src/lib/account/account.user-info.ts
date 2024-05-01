import { IsString } from 'class-validator';
import { IUser } from 'libs/interfaces/src/index';

export namespace AccountUserInfo {
  export const topic = 'account.user-info.query';

  export class Request {
    @IsString()
    id: string | undefined;
  }

  export class Response {
    user: Omit<IUser, 'passwordHash'> | undefined;
  }
}
