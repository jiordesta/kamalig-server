import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterUserDTO {
  @IsNotEmpty()
  @IsString()
  readonly username!: string;

  @IsNotEmpty()
  @IsString()
  readonly password!: string;

  @IsNotEmpty()
  @IsString()
  readonly fname!: string;

  @IsNotEmpty()
  @IsString()
  readonly lname!: string;
}

export class LoginDTO {
  @IsNotEmpty()
  @IsString()
  readonly username!: string;

  @IsNotEmpty()
  @IsString()
  readonly password!: string;
}

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  readonly fname!: string;

  @IsNotEmpty()
  @IsString()
  readonly lname!: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  readonly roleId!: number;
}

export class UpdateUserDTO {
  @IsNotEmpty()
  @IsString()
  readonly fname!: string;

  @IsNotEmpty()
  @IsString()
  readonly lname!: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  readonly roleId!: number;
}

export class CreateProductDTO {
  @IsNotEmpty()
  @Transform(({ value }) => {
    let parsed = value;

    try {
      while (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
    } catch (e) {}

    return Array.isArray(parsed) ? parsed : [];
  })
  @IsArray()
  @IsString({ each: true })
  readonly names!: string[];
}

export class UpdateProductDTO {
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    try {
      return JSON.parse(value);
    } catch {
      return value.split(',').map((v: string) => v.trim());
    }
  })
  @IsArray()
  @IsString({ each: true })
  readonly names!: string[];
}

export class CreateRestockDTO {
  @IsNotEmpty()
  readonly restockDate!: Date;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  readonly productId!: number;

  @IsOptional()
  @IsString()
  readonly brand!: string;

  @IsNotEmpty()
  readonly quantity!: number;
}

export class UpdateRestockDTO {
  @IsNotEmpty()
  readonly restockDate!: Date;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  readonly productId!: number;

  @IsOptional()
  @IsString()
  readonly brand!: string;

  @IsOptional()
  readonly quantity!: number;
}

export class TransactionItemDTO {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  readonly itemId!: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  readonly quantity!: number;

  @IsNotEmpty()
  readonly additional!: number[];
}

export class CreateTransactionDTO {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  readonly userId!: number;

  @IsNotEmpty()
  readonly transactionDate!: Date;

  @IsNotEmpty()
  readonly items!: TransactionItemDTO[];
}

export class UpdateTransactionDTO {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  readonly userId!: number;

  @IsNotEmpty()
  readonly transactionDate!: Date;

  @IsNotEmpty()
  readonly items!: TransactionItemDTO[];
}

export class ReportItemDTO {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  readonly itemId!: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  readonly quantity!: number;

  @IsNotEmpty()
  readonly additional!: number[];
}
export class CreateReportDTO {
  @IsNotEmpty()
  readonly reportDate!: Date;

  @IsNotEmpty()
  readonly items!: ReportItemDTO[];
}
