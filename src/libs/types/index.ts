export type RegisterUserData = {
  username: string;
  password: string;
  fname: string;
  lname: string;
};

export type LoginUserData = {
  username: string;
  password: string;
};

export type JWTPayload = {
  id: number;
  username: string;
};

export type CreateUserData = {
  fname: string;
  lname: string;
  roleId: number;
};

export type UpdateUserData = {
  fname: string;
  lname: string;
  roleId: number;
};

export type CreateProductData = {
  names: string[];
};

export type UpdateProductData = {
  names?: string[];
};

export type CreateRestockData = {
  restockDate: Date;
  productId: number;
  brand: string;
  quantity: number;
};

export type UpdateRestockData = {
  restockDate?: Date;
  productId?: number;
  brand?: string;
  quantity?: number;
};

export type CreateTransactionData = {
  userId: number;
  transactionDate: Date;
  items: TransactionItemData[];
};

export type TransactionItemData = {
  id?: number;
  itemId: number;
  quantity: number;
  additional: number[];
};

export type UpdateTransactionData = {
  userId: number;
  transactionDate: Date;
  items: TransactionItemData[];
};
