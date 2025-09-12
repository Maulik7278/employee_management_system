import React, { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  CreditCard, 
  TrendingUp,
  ArrowUpRight,
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  linkTo?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  gradient,
  linkTo
}) => (
  <Card className="relative overflow-hidden bg-gradient-card shadow-medium hover:shadow-strong transition-all duration-300 group">
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className="p-2 bg-primary/10 rounded-full text-primary">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <p className="text-xs text-muted-foreground mb-3">{subtitle}</p>
      {linkTo && (
        <Button asChild variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Link to={linkTo} className="flex items-center gap-2">
            View Details
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </Button>
      )}
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const { state, calculateDashboardStats, dispatch } = useApp();
  const stats = calculateDashboardStats();

  useEffect(() => {
    dispatch({ type: 'UPDATE_DASHBOARD_STATS', payload: stats });
  }, [state.branches, state.employees, state.advances, dispatch]);

  const statsCards = [
    {
      title: 'Total Branches',
      value: stats.totalBranches,
      subtitle: 'Active business locations',
      icon: <Building2 className="h-4 w-4" />,
      gradient: 'from-blue-500 to-blue-600',
      linkTo: '/branches'
    },
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      subtitle: 'Active workforce',
      icon: <Users className="h-4 w-4" />,
      gradient: 'from-green-500 to-green-600',
      linkTo: '/employees'
    },
    {
      title: 'Monthly Salary Budget',
      value: `₹${(stats.monthlyExpenditure / 1000).toFixed(0)}K`,
      subtitle: 'Current month allocation',
      icon: <CreditCard className="h-4 w-4" />,
      gradient: 'from-purple-500 to-purple-600',
      linkTo: '/salary'
    },
    {
      title: 'Total Advances',
      value: `₹${(stats.totalAdvances / 1000).toFixed(0)}K`,
      subtitle: 'Outstanding advances',
      icon: <TrendingUp className="h-4 w-4" />,
      gradient: 'from-orange-500 to-orange-600',
      linkTo: '/advances'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your diamond worker management system
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/branches">Manage Branches</Link>
          </Button>
          <Button asChild className="bg-gradient-primary hover:opacity-90">
            <Link to="/employees">Add Employee</Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-card shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Recent Branches
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.branches.slice(0, 3).map((branch) => (
              <div key={branch.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{branch.name}</p>
                  <p className="text-xs text-muted-foreground">{branch.location || 'No location'}</p>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link to={`/employees?branch=${branch.id}`}>
                    View <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full">
              <Link to="/branches">View All Branches</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Recent Employees
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.employees.slice(0, 3).map((employee) => {
              const branch = state.branches.find(b => b.id === employee.branchId);
              return (
                <div key={employee.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{employee.name}</p>
                    <p className="text-xs text-muted-foreground">{branch?.name || 'Unknown Branch'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">₹{employee.baseSalary.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Base Salary</p>
                  </div>
                </div>
              );
            })}
            <Button asChild variant="outline" className="w-full">
              <Link to="/employees">View All Employees</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Recent Advances
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.advances.slice(0, 3).map((advance) => {
              const employee = state.employees.find(e => e.id === advance.employeeId);
              return (
                <div key={advance.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{employee?.name || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(advance.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-accent-warning">₹{advance.amount.toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
            <Button asChild variant="outline" className="w-full">
              <Link to="/advances">View All Advances</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}