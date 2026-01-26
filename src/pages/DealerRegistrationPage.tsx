import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ROLES, ROLE_DISPLAY_NAMES, ROLE_SPECIFIC_FIELDS } from '@/config/rbac.config';

export default function DealerRegistrationPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const [formData, setFormData] = useState({
    dealerCode: '',
    dealerName: '',
    userName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    additionalInfo: {} as Record<string, string>,
  });

  const roleFields = ROLE_SPECIFIC_FIELDS[selectedRole as keyof typeof ROLE_SPECIFIC_FIELDS];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdditionalInfoChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo,
        [field]: value,
      },
    }));
  };

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      technician_id: 'Technician ID',
      certification_level: 'Certification Level',
      specialization: 'Specialization',
      experience_years: 'Years of Experience',
      warranty_zone: 'Warranty Zone',
      team_size: 'Team Size',
      department: 'Department',
      yearsExperience: 'Years of Experience',
      certificateNumber: 'Certificate Number',
      serviceAreaCode: 'Service Area Code',
    };
    return labels[field] || field;
  };

  const getFieldType = (field: string): string => {
    if (field.includes('years') || field.includes('size')) return 'number';
    if (field.includes('id') || field.includes('code')) return 'text';
    return 'text';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.dealerCode || !formData.dealerName || !formData.userName) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/auth/dealer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dealerCode: formData.dealerCode,
          dealerName: formData.dealerName,
          userName: formData.userName,
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          selectedRole,
          password: formData.password,
          additionalInfo: formData.additionalInfo,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error.message || 'Registration failed');
      }

      const data = await response.json();

      toast.success('Registration submitted successfully!');
      toast.message('Your registration is pending approval. You will be notified once approved.');

      // Redirect to status check page
      navigate(`/registration-status?email=${formData.email}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold">
                VW
              </div>
            </div>
            <CardTitle className="text-3xl">Dealer Registration</CardTitle>
            <CardDescription>
              Register to access the One Aftersales portal. Your registration will be reviewed and approved by the manufacturer.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dealer Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dealer Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dealerCode">Dealer Code *</Label>
                    <Input
                      id="dealerCode"
                      name="dealerCode"
                      required
                      placeholder="e.g., VW001"
                      value={formData.dealerCode}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dealerName">Dealer Name *</Label>
                    <Input
                      id="dealerName"
                      name="dealerName"
                      required
                      placeholder="Enter dealer name"
                      value={formData.dealerName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* User Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Your Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="userName">User Name *</Label>
                    <Input
                      id="userName"
                      name="userName"
                      required
                      placeholder="Your full name"
                      value={formData.userName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber">Mobile Number *</Label>
                    <Input
                      id="mobileNumber"
                      name="mobileNumber"
                      placeholder="10 digit mobile number"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      pattern="\d{10}"
                      maxLength={10}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="selectedRole">Select Your Role *</Label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ROLES).map(([key, value]) => (
                          <SelectItem key={value} value={value}>
                            {ROLE_DISPLAY_NAMES[value as keyof typeof ROLE_DISPLAY_NAMES]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Role-Specific Fields */}
              {selectedRole && roleFields && roleFields.fields.length > 0 && (
                <div className="space-y-4 p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-semibold">
                    {roleFields.description}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roleFields.fields.map((field) => (
                      <div key={field} className="space-y-2">
                        <Label htmlFor={field}>
                          {getFieldLabel(field)}
                        </Label>
                        <Input
                          id={field}
                          type={getFieldType(field)}
                          placeholder={`Enter ${getFieldLabel(field).toLowerCase()}`}
                          value={formData.additionalInfo[field] || ''}
                          onChange={(e) =>
                            handleAdditionalInfoChange(field, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Password Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Security</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="Minimum 8 characters"
                      value={formData.password}
                      onChange={handleInputChange}
                      minLength={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      minLength={8}
                    />
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> After submission, your registration will be reviewed by the manufacturer.
                  You will receive a notification once your account is approved. Only approved users can log in
                  to the portal.
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading || !selectedRole}
                >
                  {isLoading ? 'Registering...' : 'Register'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>

              {/* Login Link */}
              <div className="pt-4 border-t text-center">
                <p className="text-sm text-muted-foreground">
                  Already registered and approved?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login?type=dealer')}
                    className="text-primary hover:underline font-medium"
                  >
                    Login here
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Why do I need to select a role?</strong>
              <br />
              Your role determines which features and modules you can access in the portal after approval.
            </p>
            <p>
              <strong>What happens after I register?</strong>
              <br />
              Your registration request will be sent to the manufacturer for review and approval. This typically takes 1-2 business days.
            </p>
            <p>
              <strong>How will I know when I'm approved?</strong>
              <br />
              You can check your registration status anytime by entering your email on our status page.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
