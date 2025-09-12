import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, ArrowLeft } from 'lucide-react';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-md p-8 text-center shadow-elegant">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-3">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        
        <Button 
          onClick={() => navigate(-1)}
          variant="outline"
          className="w-full"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </Card>
    </div>
  );
};

export default Unauthorized;