import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, SignUpDto, VerifyDto } from "./dto";

@Controller ('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    @Post('/login') 
    signIn(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Post('/signup') 
    signUp(@Body() dto: SignUpDto) {
        return this.authService.signUp(dto);
    }

    @Post('/verify') 
    verify(@Body() dto: VerifyDto) {
        return this.authService.verify(dto);
    } 
}