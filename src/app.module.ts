import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TransferModule } from './transfer/transfer.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ AuthModule, UserModule, TransferModule, PrismaModule],
})

export class AppModule {}
