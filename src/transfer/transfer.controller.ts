import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransferService } from './transfer.service';
import { CreateExternalTransferDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { PayloadDTO } from 'src/user/dto';

@UseGuards(AuthGuard('jwt'))
@Controller('transfers')
export class TransferController {
    constructor(private transferService: TransferService) {}

    @Post("/external")
    createExternalTransaction(@Body() dto: CreateExternalTransferDto, @Req() req: Request) {
        const user = req.user as PayloadDTO
        return this.transferService.createExternalTransfer(user.userId, dto)
    }

    @Get("/")
    getAllTransfers(@Req() req: Request){
        const user = req.user as PayloadDTO
        return this.transferService.fetchTransfers(user.userId)
    }
}
