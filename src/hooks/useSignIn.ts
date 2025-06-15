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
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateSignInForm(email, password);
    if (!validation.isValid) {
      toast({
        title: validation.error!.title,
        description: validation.error!.description,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(email, password);
    
    if (!error) {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      navigate(from, { replace: true });
    } else {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive"
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