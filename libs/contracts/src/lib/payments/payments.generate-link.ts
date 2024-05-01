import { IsNumber, IsString } from 'class-validator';

export namespace PaymentGenerateLink {
  export const topic = 'payment.generate-link.command';

  export class Request {
    @IsString()
    userId: string | undefined;

    @IsString()
    courseId: string | undefined;

    @IsNumber()
    sum: number | undefined;
  }

  export class Response {
    paymentLink: string | null|  undefined;
  }

}

