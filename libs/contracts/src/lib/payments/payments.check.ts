import { IsString } from "class-validator";

export type PaymentStatus = 'canceled' |  'success' | 'progress';

export namespace PaymentCheck {
  export const topic = 'payment.check-payment.query';

  export class Request {
    @IsString()
    courseId: string | undefined;

    @IsString()
    userId: string | undefined;
  }

  export class Response {
    status: PaymentStatus | undefined;
  }
}
