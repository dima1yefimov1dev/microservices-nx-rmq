import { IsString } from 'class-validator';
import { ICourse } from 'libs/interfaces/src/index';

export namespace CourseGetCourse {
  export const topic = 'course.get-course.query';

  export class Request {
    @IsString()
    id: string | undefined;
  }

  export class Response {
    course: ICourse | undefined;
  }
}

