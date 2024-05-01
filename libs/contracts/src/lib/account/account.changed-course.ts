import { IsString } from 'class-validator';
import { PurchaseState } from 'libs/interfaces/src';

export namespace AccountChangeCourse {
  export const topic = 'account.changed-course.event';

  export class Request {
    @IsString()
    userId: string | undefined;

    @IsString()
    courseId: string | undefined;

    @IsString()
    state: PurchaseState | undefined;
  }

}
