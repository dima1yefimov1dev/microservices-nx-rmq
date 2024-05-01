import { IsString } from 'class-validator';
import { IUser } from 'libs/interfaces/src';

export namespace AccountChangeProfile {
  export const topic = 'account.change-profile.command';

  export class Request {
    @IsString()
    id: string | undefined;

    @IsString()
    user: Pick<IUser, 'displayName'> | undefined;
  }

  export class Response {
    profile: Omit<IUser, 'passwordHash, courses, _id'> | undefined;
  }

}
