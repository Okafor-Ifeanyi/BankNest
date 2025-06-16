import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExternalTransferDto } from './dto';

@Injectable()
export class TransferService {
    constructor(private prisma: PrismaService) {}

    async createExternalTransfer(userId: string, dto: CreateExternalTransferDto) {
        const { amount, description, type, externalTransfer } = dto;
      
        // check for sufficient balance
        const user = await this.prisma.user.findFirst({
            where: {id: userId}, select: { balance: true },
        })

        if (!(user.balance > amount)){
            // insufficient balance
            throw new BadRequestException("Insufficient Balance. Deposit and Try again")
        }

        // Step 1: Create the Transaction
        const transaction = await this.prisma.transaction.create({
          data: {
            senderId: userId,
            amount,
            type,
            description,
          },
        });
      
        const reference = this.generateReferenceCode(userId, type)

        // Step 2: Create the ExternalTransfer using transaction.id
        const extTransfer = await this.prisma.externalTransfer.create({
          data: {
            userId,
            transactionId: transaction.id,
            recipientName: externalTransfer.recipientName,
            recipientBank: externalTransfer.recipientBank,
            recipientAccount: externalTransfer.recipientAccount,
            status: "SUCCESS",
            amount,
            reference: reference
          },
        });
      
        // Deduct balance
        await this.prisma.user.update({
            where: { id: userId},
            data: {
                balance: {
                    decrement: amount
                }
            }
        })

        console.log("Transaction Created")
        return {
            "status": "success",
            "code": 201,
            "message": "Transaction Debit Successful",
            transaction,
            externalTransfer: extTransfer
        };
    }

    async fetchTransfers(userId: string) {
        const transfers = await this.prisma.transaction.findMany({
            where: { senderId: userId}, include: { externalTransfers: true }
        })

        if (transfers.length < 1) {
            return {
               status: "success",
               message: "No Transaction on this account yet" 
            }
        }

        return {
            status: "success",
            message: "Transactions Fetched Successfully",
            data: transfers
        }
    }

    generateReferenceCode(userId: string, type: string): string {
        const prefix = 'EXT';
        const shortUser = userId.slice(0, 4).toUpperCase(); // first 4 chars of userId
        const timestamp = Date.now().toString().slice(-6); // last 6 digits of timestamp
        const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4-char random string
      
        return `${prefix}-${shortUser}-${type.slice(0, 3).toUpperCase()}-${timestamp}-${randomPart}`;
      }
}