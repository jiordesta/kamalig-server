import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { RestockModule } from './restock/restock.module';
import { ConfigModule } from './config/config.module';
import { StockModule } from './stock/stock.module';
import { TransactionModule } from './transaction/transaction.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, ProductModule, RestockModule, ConfigModule, StockModule, TransactionModule, ReportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
