import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { Request } from 'express';
import { PayloadDTO, UpdateUserDto } from './dto';

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getMe(@Req() req: Request) {
        console.log(req.user)
        const user_info = req.user as PayloadDTO;
        return this.userService.fetchUsers(user_info)
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('')
    updateMe(@Req() req: Request, @Body() dto:UpdateUserDto) {
        console.log(req.user)
        const user_info = req.user as PayloadDTO;
        return this.userService.updateUser(user_info.userId, dto)
    }
}
 