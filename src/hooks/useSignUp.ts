
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { validateSignUpForm } from '@/utils/authValidation';

export const useSignUp = (onSuccess: () => void) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp } = useAuth();
  const { toast } = useToast();

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setPhone('');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateSignUpForm(email, password, confirmPassword, displayName);
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
      const { error } = await signUp(email.trim(), password, displayName.trim());
      
      if (!error) {
        toast({
          title: "Account Created Successfully!",
          description: "Please check your email for a confirmation link before signing in.",
        });
        clearForm();
        onSuccess();
      } else {
        let errorMessage = error.message;
        if (error.message.includes('already been registered')) {
          errorMessage = "This email is already registered. Please sign in instead.";
        }
        
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: errorMessage,
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Unable to connect to the server. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    displayName,
    setDisplayName,
    phone,
    setPhone,
    isLoading,
    handleSignUp
  };
};
