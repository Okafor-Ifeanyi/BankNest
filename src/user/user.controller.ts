import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
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
        const user_info = req.user as PayloadDTO;
        return this.userService.fetchUsers(user_info)
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('')
    updateMe(@Req() req: Request, @Body() dto:UpdateUserDto) {
        const user_info = req.user as PayloadDTO;
        return this.userService.updateUser(user_info.userId, dto)
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('/account')
    blockMe(@Req() req: Request) {
        const user_info = req.user as PayloadDTO;
        return this.userService.blockUser(user_info.userId)
    }
}
 