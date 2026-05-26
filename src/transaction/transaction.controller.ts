import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDTO, UpdateTransactionDTO } from 'src/libs/dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('fetchall')
  async fetchAllTransactions(
    @Query('userId', new ParseIntPipe({ optional: true })) userId?: number,
  ) {
    let filters = {
      isDeleted: false,
    };

    if (userId) {
      filters['user'] = {
        id: userId,
      };
    }

    return await this.transactionService.fetchAllTransactions(filters);
  }

  @Post('create')
  async createTransaction(@Body() createTransactionDTO: CreateTransactionDTO) {
    return await this.transactionService.createTransaction(
      createTransactionDTO,
    );
  }

  @Get('fetchitems')
  async fetchTransactionItems(
    @Query('transactionId', ParseIntPipe) transactionId: number,
  ) {
    return await this.transactionService.fetchTransactionItems(transactionId);
  }

  @Patch('update/:transactionId')
  async updateTransaction(
    @Param('transactionId', ParseIntPipe) transactionId: number,
    @Body() updateTransactionDTO: UpdateTransactionDTO,
  ) {
    return await this.transactionService.updateTransaction(
      updateTransactionDTO,
      transactionId,
    );
  }
}
