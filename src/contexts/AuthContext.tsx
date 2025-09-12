import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Employee } from '@/types';

export type UserRole = 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  employeeData?: Employee;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

interface AuthContextType {
  state: AuthState;
  login: (role: UserRole, employeeId?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('diamond-app-auth');
    if (savedAuth) {
      try {
        const user = JSON.parse(savedAuth);
        dispatch({ type: 'LOGIN', payload: user });
      } catch (error) {
        console.error('Failed to load auth from localStorage:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (role: UserRole, employeeId?: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      if (role === 'admin') {
        const adminUser: User = {
          id: 'admin-1',
          name: 'Admin User',
          role: 'admin',
        };
        
        localStorage.setItem('diamond-app-auth', JSON.stringify(adminUser));
        dispatch({ type: 'LOGIN', payload: adminUser });
        return true;
      } else if (role === 'employee' && employeeId) {
        // Mock employee lookup - in real app, this would be an API call
        const employees = JSON.parse(localStorage.getItem('diamond-worker-app') || '{}').employees || [];
        const employee = employees.find((emp: Employee) => 
          emp.id === employeeId || emp.name.toLowerCase().includes(employeeId.toLowerCase())
        );

        if (employee) {
          const employeeUser: User = {
            id: employee.id,
            name: employee.name,
            role: 'employee',
            employeeData: employee,
          };
          
          localStorage.setItem('diamond-app-auth', JSON.stringify(employeeUser));
          dispatch({ type: 'LOGIN', payload: employeeUser });
          return true;
        }
      }
      
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('diamond-app-auth');
    dispatch({ type: 'LOGOUT' });
  };

  const contextValue: AuthContextType = {
    state,
    login,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};