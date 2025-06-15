import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

const LoginPage = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

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
                <Mail className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle>
              {mode === 'signin' ? 'Sign In to Your Account' : 'Create Your Account'}
            </CardTitle>
            <CardDescription>
              {mode === 'signin' 
                ? 'Enter your email and password to access your account' 
                : 'Fill in the details below to create your account'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {mode === 'signin' ? (
              <SignInForm onSwitchToSignUp={() => setMode('signup')} />
            ) : (
              <SignUpForm onSwitchToSignIn={() => setMode('signin')} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;