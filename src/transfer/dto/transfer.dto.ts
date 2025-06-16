import { IsNotEmpty, IsNumber, IsString, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

enum TransactionType {
  INTERNAL_TRANSFER = 'INTERNAL_TRANSFER',
  EXTERNAL_TRANSFER = 'EXTERNAL_TRANSFER',
}

enum TransferStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

class ExternalTransferDetailsDTO {
  @IsNotEmpty()
  @IsString()
  recipientName: string;

  @IsNotEmpty()
  @IsString()
  recipientBank: string;

  @IsNotEmpty()
  @IsString()
  recipientAccount: string;
}

export class CreateExternalTransferDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType; // should be EXTERNAL_TRANSFER

  @IsNotEmpty()
  @IsString()
  description: string;

  @ValidateNested()
  @Type(() => ExternalTransferDetailsDTO)
  externalTransfer: ExternalTransferDetailsDTO;
}