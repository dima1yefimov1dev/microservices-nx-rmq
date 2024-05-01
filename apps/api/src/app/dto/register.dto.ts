import { IsEmail, IsString } from 'class-validator';

  export class RegisterDto {
    @IsEmail()
    email: string | undefined;

    @IsString()
    password: string | undefined;

    @IsString()
    displayName: string | undefined;

  }

