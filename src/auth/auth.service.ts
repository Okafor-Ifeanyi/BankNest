import { Injectable } from "@nestjs/common";

@Injectable ({})
export class AuthService {
    login() {
        return "Login successful";
    }

    signUp() {
        return "Sign up successful";
    }
}