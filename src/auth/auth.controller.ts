import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PrismaService } from "src/prisma/prisma.service";

@Controller ('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private prisma: PrismaService
    ) { }

    @Post('/login')
    signIn() {
        // Logic for signing in a user
        return this.authService.login();
    }

    @Post('/signup')
    signUp() {
        // Logic for signing up a user
        return this.authService.signUp();
    }
}