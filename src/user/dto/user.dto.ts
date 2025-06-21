import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class PayloadDTO {
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}  

import { IsOptional, IsString, IsPhoneNumber, IsBoolean, IsNumber, Min } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  accountNumber?: string;

  @IsOptional()
  @IsString()
  name?: string;
  
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Phone number must be valid' })
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  balance?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  loanBalance?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  savingsBalance?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
