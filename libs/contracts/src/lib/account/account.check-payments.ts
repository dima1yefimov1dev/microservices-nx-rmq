import { IsString } from 'class-validator';
import { PaymentStatus } from '../payments/payments.check';

export namespace AccountCheckPayment {
  export const topic = 'account.check-payment.query';

  export class Request {
    @IsString()
    userId: string | undefined;

    @IsString()
    courseId: string | undefined;
  }

  export class Response {
    status: PaymentStatus | undefined;
  }

}
