import { IsString } from 'class-validator';
import { IUserCourses } from 'libs/interfaces/src/index';

export namespace AccountUserCourses {
  export const topic = 'account.user-courses.query';

  export class Request {
    @IsString()
    id: string | undefined;
  }

  export class Response {
    courses: IUserCourses[] | undefined;
  }

}
