import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PayloadDTO } from './dto';
import { User } from 'generated/prisma';

@Injectable()
export class UserService {
    constructor( private prisma: PrismaService) {}

    async fetchUsers(user_info: PayloadDTO) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: user_info.email
            }
        }) 
        delete user.password
        return {
            status: "success",
            message: "Data Fetched successfully",
            data: user
        }
    }

    async updateUser(userId: string, user_info: Partial<User>, ) {
        const user = await this.prisma.user.update({
            where: {
                id: userId
            }, data: {
                ...user_info
            }
        }) 
        delete user.password
        return {
            status: "success",
            message: "Data Fetched successfully",
            data: user
        }
    }
}
