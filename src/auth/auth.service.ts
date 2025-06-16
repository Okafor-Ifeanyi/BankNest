import { ForbiddenException, Injectable } from "@nestjs/common";
import { LoginDto, SignUpDto, VerifyDto } from "./dto";
import * as argon from "argon2";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientKnownRequestError } from "generated/prisma/runtime/library";
import { MailService } from "src/mail/mail.service";
import { User } from "generated/prisma";
import { JwtService } from "@nestjs/jwt";

@Injectable ()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private readonly mailService: MailService, // Assuming you have a MailService for sending emails
        private readonly jwtService: JwtService, // Uncomment if you plan to use JWT for authentication
    ) {}

    async login(dto: LoginDto) {
        // find the user
        const user = await this.findUserByAccountNumber(dto.account);

        if (!user) {
            throw new ForbiddenException('Credentials incorrect, Account.');
        }

        // compare password
        const passwordMatches = await argon.verify(user.password, dto.password);

        if( !passwordMatches) { 
            throw new ForbiddenException('Credentials incorrect, Password.');
        }

        // Store OTP in the database or cache
        const otp = this.generateOtp();
       
        // Send OTP to user's email
        await this.sendOtpEmail(user, otp);

        await this.prisma.otp.create({
            data: {
                userId: user.id,
                code: otp,
                type: "LOGIN",
                expiresAt: new Date(Date.now() + 5 * 60 * 1000), // OTP valid for 10 minutes
            },
        });
        
        delete user.password; // Remove password from the response

        console.log(otp)
        
        // Return user data without password
        return {
            "status": "success",
            "code": 201,
            "message":"OTP Sent, Verify to login.",
        };
    }

    async signUp(dto: SignUpDto) {
        const account_number = await this.generateAccountNumber();

        const hashedPassword = await this.hashPassword(dto.password);

        try {
            // Create user in the database
            const new_user = await this.prisma.user.create({
                data: {
                    ...dto,
                    password: hashedPassword,
                    accountNumber: account_number,
                },
            });

            delete new_user.password; // Remove password from the response

            return {
                "status": "success",
                "code": 201,
                "message":"Sign up successful",
                "data": new_user
            };
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    // Unique constraint failed
                    throw new ForbiddenException('Credential taken, Either email or phone number already exists');  
                }
            }
            throw new ForbiddenException(error.message)
        }
    }

    async verify(dto: VerifyDto) {
        // Find the user by account number
        const user = await this.findUserByAccountNumber(dto.account);

        if (!user) {
            throw new ForbiddenException('Account not found.');
        }
        // Find the OTP for the user
        const otpRecord = await this.prisma.otp.findFirst({
            where: {
                userId: user.id,
                code: dto.otp,
                type: "LOGIN",
                expiresAt: {
                    gt: new Date(), // Check if OTP is still valid
                },
            },
        });

        if (!otpRecord) {
            throw new ForbiddenException('Invalid or expired OTP.');
        }

        // Delete the OTP record after successful verification
        await this.prisma.otp.delete({
            where: { id: otpRecord.id },
        });

        // Generate JWT token
        const token = await this.signToken(user.id, user.email);

        return {
            "status": "success",
            "code": 200,
            "message":"Login successful.",
            "token": token,
            "data": user
        };
    }

    async signToken(userId: string, email: string) {

        const payload = {
            sub: userId,
            email
        };

        // Generate JWT token
        return await this.jwtService.signAsync(payload, {
            expiresIn: '1h', // Token expiration time
            secret: process.env.JWT_SECRET, // Ensure you have a JWT secret in your environment variables
        });
    }

    hashPassword(password: string): Promise<string> {
        return argon.hash(password);
    }

    generateOtp(): string {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
        return otp;
    }

    async generateAccountNumber(): Promise<string> {
        const randomNumber = Math.floor(Math.random() * 1000000000);

        // Ensure account Number doesn't exist on db
        const existingAccount = await this.prisma.user.findFirst({
            where: { accountNumber: randomNumber.toString().padStart(10, '0') },
        });

        if( existingAccount) {
            // If the account number already exists, generate a new one
            return this.generateAccountNumber();
        }

        return randomNumber.toString().padStart(10, '0');
    }

    findUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    findUserByAccountNumber(account: string) {
        return this.prisma.user.findUnique({
            where: { accountNumber: account },
        });
    }

    async sendOtpEmail(user: User, otp: string) {
        const html = `<p>Your OTP is <strong>${otp}</strong></p>`;
        await this.mailService.sendMail(user.email, 'Your OTP Code', html);
    }

    async sendAccountEmail(user: User, otp: string) {
        const html = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Welcome to Evertrust Trust Bank!</h2>
                <p>Hi ${user.name},</p>
                <p>We're excited to have you on board. Your account has been successfully created.</p>
                <p>Your Account Number is: <strong>${user.accountNumber}</strong></p>
                <p>Please keep this number safe as it will be required for future logins and support requests.</p>
                <br />
                <p>If you have any questions, feel free to reply to this email.</p>
                <p>Cheers,<br />The EverTrust Team</p>
            </div>
        `;
        await this.mailService.sendMail(user.email, 'Welcome to EverTrust', html);
    }  
}