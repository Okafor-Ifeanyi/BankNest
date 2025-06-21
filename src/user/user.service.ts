import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PayloadDTO } from './dto';
import { User } from 'generated/prisma';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
    constructor( 
        private prisma: PrismaService,
        private readonly mailService: MailService, // Assuming you have a MailService for sending emails

    ) {}

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

    async blockUser(userId: string ) {
        const user = await this.prisma.user.update({
            where: {
                id: userId
            }, data: {
                blocked: true,
            }
        }) 
        delete user.password

        // Write email here
        await this.sendBlockUserEmail(user)

        return {
            status: "success",
            message: "user account Blocked",
        }
    }

    async sendBlockUserEmail(user: User) {
        const html = `
          <div style="font-family: Arial, sans-serif; background-color: #ffffff; padding: 20px; color: #333; border: 1px solid #e5e5e5; border-radius: 8px; max-width: 600px; margin: auto;">
            <h2 style="color: #b91c1c;">⚠️ Account Blocked Notification</h2>
            <p>Dear ${user.name},</p>
            <p>
              Your account has been <strong style="color: #b91c1c;">blocked or suspended</strong> from initiating transfers due to Suspicious login from a different IP/ Location..
              Please visit a branch closest to you for further instructions on how to reactivate your account.
            </p>
            <p>If you did not attempt to perform this action, please contact support immediately.</p>
            <br />
            <p style="color: #888;">Thank you,<br />The Support Team</p>
          </div>
        `;
      
        await this.mailService.sendMail(user.email, '🚫 Account Blocked!', html);
      }
}
