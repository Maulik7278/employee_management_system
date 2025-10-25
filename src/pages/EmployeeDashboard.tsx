import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  CreditCard, 
  TrendingUp, 
  Calendar,
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const EmployeeDashboard: React.FC = () => {
  const { state: authState } = useAuth();
  const { state, getEmployeeAdvances, getEmployeeAttendance } = useApp();
  const [attendanceFilter, setAttendanceFilter] = useState<'today' | 'last30'>('today');
  
  if (!authState.user?.employeeData) {
    return <div>Employee data not found</div>;
  }

  const employee = authState.user.employeeData;
  const branch = state.branches.find(b => b.id === employee.branchId);
  const advances = getEmployeeAdvances(employee.id);
  const totalAdvances = advances.reduce((sum, advance) => sum + advance.amount, 0);
  
  // Mock salary calculation for current month
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const netSalary = employee.baseSalary - totalAdvances;

  // Get attendance data
  const getMyAttendanceData = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
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
    const absentDays = attendanceRecords.filter(att => att.status === 'absent').length;
    const totalDuration = attendanceRecords
      .filter(att => att.workingDuration)
      .reduce((sum, att) => sum + (att.workingDuration || 0), 0);
    
    const avgDuration = presentDays > 0 ? Math.floor(totalDuration / presentDays) : 0;
    const todayAttendance = attendanceRecords.find(att => att.date.getTime() >= today.getTime());
    
    return {
      records: attendanceRecords.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10),
      presentDays,
      absentDays,
      totalDays: attendanceRecords.length,
      avgDuration,
      totalDuration,
      todayStatus: todayAttendance?.status || 'absent',
      todayDuration: todayAttendance?.workingDuration || 0
    };
  };

  const attendanceData = getMyAttendanceData();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-primary rounded-xl p-6 text-white shadow-glow">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {employee.name}!</h1>
        <p className="text-white/80">Here's your personal dashboard</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Profile */}
        <Card className="lg:col-span-1 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Personal Profile</h2>
          </div>
          <div className="space-y-4">
            {employee.image && (
              <div className="flex justify-center">
                <img 
                  src={employee.image} 
                  alt={employee.name}
                  className="h-20 w-20 rounded-full object-cover border-2 border-primary/20"
                />
              </div>
            )}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Age:</span>
                <span>{employee.age} years</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employee.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employee.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employee.upiId}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{branch?.name || 'Unknown Branch'}</span>
              </div>
              {branch?.location && (
                <div className="text-xs text-muted-foreground ml-6">
                  {branch.location}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Salary Summary */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <IndianRupee className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Salary Summary - {currentMonth}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Base Salary</p>
              <p className="text-xl font-bold text-primary">₹{employee.baseSalary.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Advances Taken</p>
              <p className="text-xl font-bold text-destructive">₹{totalAdvances.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Net Payable</p>
              <p className="text-xl font-bold text-primary">₹{netSalary.toLocaleString()}</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <h3 className="font-medium flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Recent Activity</span>
            </h3>
            {advances.length > 0 ? (
              <div className="space-y-2">
                {advances.slice(0, 3).map((advance) => (
                  <div key={advance.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Advance Taken</p>
                      <p className="text-xs text-muted-foreground">
                        {advance.date.toLocaleDateString()} • {advance.description || 'No description'}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-destructive border-destructive/50">
                      -₹{advance.amount.toLocaleString()}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent advances taken</p>
            )}
          </div>
        </Card>
      </div>

      {/* Advances History */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Advances History</h2>
        </div>
        
        {advances.length > 0 ? (
          <div className="space-y-3">
            {advances.map((advance) => (
              <div key={advance.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">₹{advance.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {advance.date.toLocaleDateString()}
                    </p>
                  </div>
                  {advance.description && (
                    <p className="text-sm text-muted-foreground mt-1">{advance.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No advances taken yet</p>
          </div>
        )}
      </Card>

      {/* My Attendance Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">My Attendance</h2>
          </div>
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

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <Badge 
              variant={attendanceData.todayStatus === 'present' ? 'default' : 'destructive'}
              className="flex items-center justify-center gap-1"
            >
              {attendanceData.todayStatus === 'present' ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              {attendanceData.todayStatus}
            </Badge>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Present Days</p>
            <p className="text-xl font-bold text-primary">{attendanceData.presentDays}</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Absent Days</p>
            <p className="text-xl font-bold text-destructive">{attendanceData.absentDays}</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Avg Duration</p>
            <p className="text-xl font-bold text-foreground">
              {Math.floor(attendanceData.avgDuration / 60)}h {attendanceData.avgDuration % 60}m
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Recent Attendance Records */}
        <div className="space-y-3">
          <h3 className="font-medium">Recent Records</h3>
          {attendanceData.records.length > 0 ? (
            <div className="space-y-2">
              {attendanceData.records.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">
                      {record.date.toLocaleDateString('en-IN', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                    {record.workingDuration && (
                      <p className="text-xs text-muted-foreground">
                        Duration: {Math.floor(record.workingDuration / 60)}h {record.workingDuration % 60}m
                      </p>
                    )}
                  </div>
                  <Badge 
                    variant={record.status === 'present' ? 'default' : 'destructive'}
                    className="flex items-center gap-1"
                  >
                    {record.status === 'present' ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {record.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No attendance records found</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;