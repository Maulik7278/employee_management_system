import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Branch, Employee, Advance, SalaryPayment, DashboardStats } from '@/types';

// Mock data for initial state
const mockBranches: Branch[] = [
  {
    id: '1',
    name: 'Main Branch',
    location: 'Mumbai Central',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'South Branch',
    location: 'Pune',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
];

const mockEmployees: Employee[] = [
  {
    id: '1',
    branchId: '1',
    name: 'Raj Kumar',
    age: 28,
    email: 'raj.kumar@email.com',
    phone: '+91-9876543210',
    upiId: 'rajkumar@paytm',
    baseSalary: 45000,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    branchId: '1',
    name: 'Priya Singh',
    age: 25,
    email: 'priya.singh@email.com',
    phone: '+91-9876543211',
    upiId: 'priya@phonepe',
    baseSalary: 38000,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: '3',
    branchId: '2',
    name: 'Mohammed Ali',
    age: 32,
    email: 'mohammed.ali@email.com',
    phone: '+91-9876543212',
    upiId: 'ali@googlepay',
    baseSalary: 52000,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
];

const mockAdvances: Advance[] = [
  {
    id: '1',
    employeeId: '1',
    branchId: '1',
    amount: 5000,
    date: new Date('2024-03-01'),
    description: 'Medical emergency',
  },
  {
    id: '2',
    employeeId: '2',
    branchId: '1',
    amount: 3000,
    date: new Date('2024-03-05'),
    description: 'Festival advance',
  },
];

interface AppState {
  branches: Branch[];
  employees: Employee[];
  advances: Advance[];
  salaryPayments: SalaryPayment[];
  dashboardStats: DashboardStats;
}

type AppAction =
  | { type: 'ADD_BRANCH'; payload: Branch }
  | { type: 'UPDATE_BRANCH'; payload: Branch }
  | { type: 'DELETE_BRANCH'; payload: string }
  | { type: 'ADD_EMPLOYEE'; payload: Employee }
  | { type: 'UPDATE_EMPLOYEE'; payload: Employee }
  | { type: 'DELETE_EMPLOYEE'; payload: string }
  | { type: 'ADD_ADVANCE'; payload: Advance }
  | { type: 'UPDATE_ADVANCE'; payload: Advance }
  | { type: 'DELETE_ADVANCE'; payload: string }
  | { type: 'ADD_SALARY_PAYMENT'; payload: SalaryPayment }
  | { type: 'UPDATE_DASHBOARD_STATS'; payload: DashboardStats }
  | { type: 'LOAD_FROM_STORAGE'; payload: AppState };

const initialState: AppState = {
  branches: mockBranches,
  employees: mockEmployees,
  advances: mockAdvances,
  salaryPayments: [],
  dashboardStats: {
    totalBranches: 0,
    totalEmployees: 0,
    monthlyExpenditure: 0,
    totalAdvances: 0,
    pendingSalaries: 0,
  },
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_FROM_STORAGE':
      return action.payload;
    case 'ADD_BRANCH':
      return { ...state, branches: [...state.branches, action.payload] };
    case 'UPDATE_BRANCH':
      return {
        ...state,
        branches: state.branches.map(branch =>
          branch.id === action.payload.id ? action.payload : branch
        ),
      };
    case 'DELETE_BRANCH':
      return {
        ...state,
        branches: state.branches.filter(branch => branch.id !== action.payload),
        employees: state.employees.filter(employee => employee.branchId !== action.payload),
      };
    case 'ADD_EMPLOYEE':
      return { ...state, employees: [...state.employees, action.payload] };
    case 'UPDATE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.map(employee =>
          employee.id === action.payload.id ? action.payload : employee
        ),
      };
    case 'DELETE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.filter(employee => employee.id !== action.payload),
        advances: state.advances.filter(advance => advance.employeeId !== action.payload),
      };
    case 'ADD_ADVANCE':
      return { ...state, advances: [...state.advances, action.payload] };
    case 'UPDATE_ADVANCE':
      return {
        ...state,
        advances: state.advances.map(advance =>
          advance.id === action.payload.id ? action.payload : advance
        ),
      };
    case 'DELETE_ADVANCE':
      return {
        ...state,
        advances: state.advances.filter(advance => advance.id !== action.payload),
      };
    case 'ADD_SALARY_PAYMENT':
      return { ...state, salaryPayments: [...state.salaryPayments, action.payload] };
    case 'UPDATE_DASHBOARD_STATS':
      return { ...state, dashboardStats: action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  getBranchEmployees: (branchId: string) => Employee[];
  getEmployeeAdvances: (employeeId: string) => Advance[];
  calculateDashboardStats: () => DashboardStats;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('diamond-worker-app');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsedData });
      } catch (error) {
        console.error('Failed to load data from localStorage:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('diamond-worker-app', JSON.stringify(state));
  }, [state]);

  // Helper functions
  const getBranchEmployees = (branchId: string): Employee[] => {
    return state.employees.filter(employee => employee.branchId === branchId);
  };

  const getEmployeeAdvances = (employeeId: string): Advance[] => {
    return state.advances.filter(advance => advance.employeeId === employeeId);
  };

  const calculateDashboardStats = (): DashboardStats => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const totalBranches = state.branches.length;
    const totalEmployees = state.employees.length;
    const monthlyExpenditure = state.employees.reduce((sum, emp) => sum + emp.baseSalary, 0);
    const totalAdvances = state.advances.reduce((sum, advance) => sum + advance.amount, 0);
    const pendingSalaries = state.employees.length * 1000; // Mock pending calculation

    return {
      totalBranches,
      totalEmployees,
      monthlyExpenditure,
      totalAdvances,
      pendingSalaries,
    };
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    getBranchEmployees,
    getEmployeeAdvances,
    calculateDashboardStats,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};