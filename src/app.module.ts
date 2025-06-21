import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TransferModule } from './transfer/transfer.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [AuthModule, UserModule, TransferModule, PrismaModule, MailModule, UtilsModule],
})
export class AppModule {}
