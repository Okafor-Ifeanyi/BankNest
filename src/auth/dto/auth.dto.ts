import { IsEmail, isNotEmpty, IsNotEmpty, IsOptional } from "class-validator";

export class AuthDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}       

export class SignUpDto extends AuthDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    phone: string;

    @IsOptional()
    profilePicture?: string;
}

export class LoginDto {
    @IsNotEmpty()
    account: string;

    @IsNotEmpty()
    password: string;
}    

export class VerifyDto {
    @IsNotEmpty()
    account: string;

    @IsNotEmpty()
    otp: string;
}