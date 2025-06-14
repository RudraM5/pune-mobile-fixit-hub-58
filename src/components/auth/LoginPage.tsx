import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Phone, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phone.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    // Simulate sending OTP
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setStep('otp');
    
    toast({
      title: "OTP Sent",
      description: `Verification code sent to +91 ${phone}`,
    });
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 4-digit verification code",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const success = await login(phone, otp);
    
    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      navigate(from, { replace: true });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-6">
          <Link to="/" className="flex items-center text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                <Phone className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle>
              {step === 'phone' ? 'Enter Your Phone Number' : 'Verify OTP'}
            </CardTitle>
            <CardDescription>
              {step === 'phone' 
                ? 'We will send you a verification code' 
                : `Enter the 4-digit code sent to +91 ${phone}`
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {step === 'phone' ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                      <span className="text-sm text-muted-foreground">+91</span>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="rounded-l-none"
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
                
                <div className="text-center text-sm text-muted-foreground">
                  <p>Demo credentials:</p>
                  <p>Admin: 9876543210, OTP: 1234</p>
                  <p>Customer: Any number, OTP: 1234</p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label>Verification Code</Label>
                  <div className="flex justify-center">
                    <InputOTP 
                      maxLength={4} 
                      value={otp} 
                      onChange={setOtp}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Verify & Login'}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setStep('phone')}
                >
                  Change Phone Number
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;