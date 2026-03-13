import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Shield, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';

export function KYCPage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    idType: user?.kycDocuments?.idType || '',
    idNumber: user?.kycDocuments?.idNumber || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate KYC verification process
    setTimeout(() => {
      updateUser({
        kycStatus: 'verified',
        kycDocuments: {
          ...formData,
          idDocument: 'uploaded',
          selfie: 'uploaded',
          proofOfAddress: 'uploaded',
        },
      });
      toast.success('KYC verification submitted successfully!');
      setLoading(false);
    }, 2000);
  };

  const getStatusBadge = () => {
    switch (user?.kycStatus) {
      case 'verified':
        return (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Verified</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center space-x-2 text-amber-600">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Pending Review</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Rejected</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 text-gray-600">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Not Started</span>
          </div>
        );
    }
  };

  if (user?.kycStatus === 'verified') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>KYC Verification</CardTitle>
                <CardDescription>Your account is verified</CardDescription>
              </div>
              {getStatusBadge()}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Account Verified</h3>
              <p className="text-gray-600">
                Your account has been successfully verified. You now have access to all MwalaPay features.
              </p>
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Verified Information:</strong>
                </p>
                <ul className="mt-2 text-sm text-green-700 space-y-1">
                  <li>ID Type: {user.kycDocuments?.idType}</li>
                  <li>ID Number: {user.kycDocuments?.idNumber}</li>
                  <li>Documents: All uploaded and verified</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>KYC Verification</CardTitle>
              <CardDescription>Complete your verification to unlock all features</CardDescription>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Why verify your account?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Increased transaction limits</li>
              <li>• Access to international payments</li>
              <li>• Virtual card creation</li>
              <li>• Crypto trading and wallet</li>
              <li>• Bank account linking</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="idType">ID Document Type</Label>
                <Select
                  value={formData.idType}
                  onValueChange={(value) => setFormData({ ...formData, idType: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="national_id">National ID</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="drivers_license">Driver's License</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idNumber">ID Number</Label>
                <Input
                  id="idNumber"
                  type="text"
                  placeholder="Enter your ID number"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Upload ID Document</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG or PDF (max. 5MB)</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Upload Selfie</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Take a selfie or upload photo</p>
                  <p className="text-xs text-gray-500 mt-1">PNG or JPG (max. 5MB)</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Proof of Address</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Upload utility bill or bank statement</p>
                  <p className="text-xs text-gray-500 mt-1">PDF or image (max. 5MB)</p>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </Button>

            <p className="text-xs text-center text-gray-500">
              Your documents are encrypted and securely stored. We comply with all data protection regulations.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
