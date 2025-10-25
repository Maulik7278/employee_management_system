import React, { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  CreditCard, 
  TrendingUp,
  ArrowUpRight,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle
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
  const { state, calculateDashboardStats, dispatch, getEmployeeAttendance } = useApp();
  const stats = calculateDashboardStats();
  const [attendanceFilter, setAttendanceFilter] = useState<'today' | 'last30'>('today');

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

  // Calculate attendance data
  const getAttendanceData = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return state.employees.map(employee => {
      const branch = state.branches.find(b => b.id === employee.branchId);
      let attendanceRecords;
      
      if (attendanceFilter === 'today') {
        attendanceRecords = state.attendance.filter(
          att => att.employeeId === employee.id && 
          att.date.getTime() >= today.getTime()
        );
      } else {
        const cutoff = new Date(today);
        cutoff.setDate(cutoff.getDate() - 30);
        attendanceRecords = state.attendance.filter(
          att => att.employeeId === employee.id && 
          att.date >= cutoff
        );
      }
      
      const presentDays = attendanceRecords.filter(att => att.status === 'present').length;
      const totalDuration = attendanceRecords
        .filter(att => att.workingDuration)
        .reduce((sum, att) => sum + (att.workingDuration || 0), 0);
      
      const avgDuration = presentDays > 0 ? Math.floor(totalDuration / presentDays) : 0;
      const todayAttendance = attendanceRecords.find(att => att.date.getTime() >= today.getTime());
      
      return {
        employee,
        branch: branch?.name || 'Unknown',
        status: todayAttendance?.status || 'absent',
        presentDays,
        totalDays: attendanceRecords.length,
        avgDuration,
        todayDuration: todayAttendance?.workingDuration || 0
      };
    });
  };

  const attendanceData = getAttendanceData();

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

      {/* Attendance Card */}
      <Card className="bg-gradient-card shadow-medium">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Employee Attendance
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={attendanceFilter === 'today' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAttendanceFilter('today')}
              >
                Today
              </Button>
              <Button
                variant={attendanceFilter === 'last30' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAttendanceFilter('last30')}
              >
                Last 30 Days
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {attendanceData.map(({ employee, branch, status, presentDays, totalDays, avgDuration, todayDuration }) => (
              <div 
                key={employee.id} 
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  {employee.image && (
                    <img 
                      src={employee.image} 
                      alt={employee.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium text-foreground">{employee.name}</p>
                    <p className="text-xs text-muted-foreground">{branch}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {attendanceFilter === 'today' ? (
                    <>
                      <Badge 
                        variant={status === 'present' ? 'default' : 'destructive'}
                        className="flex items-center gap-1"
                      >
                        {status === 'present' ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {status}
                      </Badge>
                      {status === 'present' && todayDuration > 0 && (
                        <div className="text-sm text-muted-foreground">
                          {Math.floor(todayDuration / 60)}h {todayDuration % 60}m
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="text-sm text-center">
                        <p className="font-medium text-foreground">{presentDays}/{totalDays}</p>
                        <p className="text-xs text-muted-foreground">Present</p>
                      </div>
                      <div className="text-sm text-center">
                        <p className="font-medium text-foreground">{Math.floor(avgDuration / 60)}h {avgDuration % 60}m</p>
                        <p className="text-xs text-muted-foreground">Avg Time</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}