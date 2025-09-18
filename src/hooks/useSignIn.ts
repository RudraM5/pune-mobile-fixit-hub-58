
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { validateSignInForm } from '@/utils/authValidation';

export const useSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const from = location.state?.from?.pathname || '/';

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateSignInForm(email, password);
    if (!validation.isValid) {
      toast({
        variant: "destructive",
        title: validation.error!.title,
        description: validation.error!.description,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (!error) {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate('/', { replace: true });
      } else {
        let errorMessage = error.message;
        let errorTitle = "Sign In Failed";
        
        // Handle specific error cases
        if (error.message.includes('Email not confirmed')) {
          errorTitle = "Email Confirmation Required";
          errorMessage = "Please check your email and click the confirmation link before signing in.";
        } else if (error.message.includes('Invalid login credentials')) {
          errorTitle = "Invalid Credentials";
          errorMessage = "The email or password you entered is incorrect. Please try again.";
        }
        
        toast({
          variant: "destructive",
          title: errorTitle,
          description: errorMessage,
        });
        setIsLoading(false);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Unable to connect to the server. Please try again.",
      });
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleSignIn
  };
};
