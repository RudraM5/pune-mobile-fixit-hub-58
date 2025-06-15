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
    
    const validation = validateSignUpForm(email, password, confirmPassword, displayName);
    if (!validation.isValid) {
      toast({
        title: validation.error!.title,
        description: validation.error!.description,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await signUp(email.trim(), password, {
        display_name: displayName.trim(),
        phone: phone?.trim() || null,
        role: 'customer'
      });
      
      if (!error) {
        toast({
          title: "Account Created Successfully!",
          description: "Please check your email to confirm your account before signing in.",
        });
        clearForm();
        onSuccess();
      } else {
        // More specific error handling
        let errorMessage = "Failed to create account. Please try again.";
        
        if (error.message?.includes("already registered")) {
          errorMessage = "An account with this email already exists. Please sign in instead.";
        } else if (error.message?.includes("email")) {
          errorMessage = "Please enter a valid email address.";
        } else if (error.message?.includes("password")) {
          errorMessage = "Password requirements not met. Please choose a stronger password.";
        }
        
        toast({
          title: "Sign Up Failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Network Error",
        description: "Please check your connection and try again.",
        variant: "destructive"
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