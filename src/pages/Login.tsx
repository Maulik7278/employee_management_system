import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, User, Gem } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState('');

  const handleLogin = async (role: UserRole) => {
    setIsLoading(true);
    
    try {
      const success = await login(role, role === 'employee' ? employeeId : undefined);
      
      if (success) {
        toast({
          title: 'Login Successful',
          description: `Welcome ${role === 'admin' ? 'Admin' : 'Employee'}!`,
        });
        navigate('/');
      } else {
        toast({
          title: 'Login Failed',
          description: role === 'employee' 
            ? 'Employee not found. Please check your ID or name.' 
            : 'Login failed. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during login.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-md p-8 shadow-elegant border-primary/10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
              <Gem className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Diamond Manager</h1>
          <p className="text-muted-foreground">Select your role to continue</p>
        </div>

        <Tabs defaultValue="admin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin
            </TabsTrigger>
            <TabsTrigger value="employee" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Employee
            </TabsTrigger>
          </TabsList>

          <TabsContent value="admin" className="space-y-4 mt-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Access all features including branch management, employee records, and financial tracking.
              </p>
              <Button 
                onClick={() => handleLogin('admin')}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Logging in...' : 'Login as Admin'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="employee" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID or Name</Label>
                <Input
                  id="employeeId"
                  placeholder="Enter your employee ID or name"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Try: "Raj Kumar", "Priya Singh", or "Mohammed Ali"
              </p>
              <Button 
                onClick={() => handleLogin('employee')}
                disabled={isLoading || !employeeId.trim()}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Logging in...' : 'Login as Employee'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;