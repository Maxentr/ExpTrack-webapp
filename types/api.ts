export type HTTPException = {
  message: string;
  path: string;
  statusCode: number;
  timestamp: string;
};

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export type Expense = {
  id: number;
  name: string;
  description?: string;
  date: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  paidBy: number;
  categoryId: number;
  groupId: number;
};

export interface ExpenseWithMembers extends Expense {
  members: ExpenseMember[];
}

export type ExpenseMember = {
  id: number;
  amount: number;
  hasPaid: boolean;
  expenseId: number;
  userId: number;
};

export interface CustomExpenseMember
  extends User,
    Omit<ExpenseMember, "id" | "userId" | "expenseId"> {
  expenseMemberId: number;
}

export type ExpenseCategory = {
  id: number;
  name: string;
  global: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  groupId: number | null;
};

export type Group = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export interface GroupWithMembers extends Group {
  members: User[];
}
