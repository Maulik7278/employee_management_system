// Core business entities for diamond worker management

export interface Branch {
  id: string;
  name: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Employee {
  id: string;
  branchId: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  upiId: string;
  baseSalary: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Advance {
  id: string;
  employeeId: string;
  branchId: string;
  amount: number;
  date: Date;
  description?: string;
}

export interface SalaryPayment {
  id: string;
  employeeId: string;
  branchId: string;
  month: number;
  year: number;
  baseSalary: number;
  advances: number;
  netSalary: number;
  paymentDate: Date;
  status: 'paid' | 'pending' | 'partial';
}

export interface DashboardStats {
  totalBranches: number;
  totalEmployees: number;
  monthlyExpenditure: number;
  totalAdvances: number;
  pendingSalaries: number;
}

// Form types for various operations
export interface BranchFormData {
  name: string;
  location?: string;
}

export interface EmployeeFormData {
  name: string;
  age: number;
  email: string;
  phone: string;
  upiId: string;
  baseSalary: number;
  image?: string;
}

export interface AdvanceFormData {
  employeeId: string;
  amount: number;
  date: Date;
  description?: string;
}

export interface SalaryFormData {
  employeeId: string;
  month: number;
  year: number;
  advances: number;
}