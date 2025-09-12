import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Building2, 
  Plus,
  Search,
  Users,
  MapPin,
  Edit,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Branches() {
  const { state, getBranchEmployees } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBranches = state.branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (branch.location && branch.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Branches</h1>
          <p className="text-muted-foreground">
            Manage your business locations and their workforce
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" />
          Add Branch
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search branches by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Branches Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBranches.map((branch) => {
          const employeeCount = getBranchEmployees(branch.id).length;
          return (
            <Card key={branch.id} className="bg-gradient-card shadow-medium hover:shadow-strong transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{branch.name}</CardTitle>
                      {branch.location && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {branch.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{employeeCount} employees</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created {new Date(branch.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to={`/employees?branch=${branch.id}`}>
                      View Employees
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1 bg-gradient-primary hover:opacity-90">
                    <Link to={`/employees/add?branch=${branch.id}`}>
                      Add Employee
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredBranches.length === 0 && (
        <Card className="bg-gradient-card shadow-medium">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-4 bg-muted rounded-full mb-4">
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchTerm ? 'No branches found' : 'No branches yet'}
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              {searchTerm 
                ? 'Try adjusting your search criteria to find the branch you\'re looking for.'
                : 'Get started by adding your first branch location to manage your workforce.'
              }
            </p>
            {!searchTerm && (
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Branch
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}