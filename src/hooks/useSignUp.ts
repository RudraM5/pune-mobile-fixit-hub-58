
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useSignUp = (onSuccess: () => void) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp } = useAuth();

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setPhone('');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim() || !confirmPassword.trim() || !displayName.trim()) {
      console.log('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      console.log('Password must be at least 6 characters');
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
        console.log('Account created successfully');
        clearForm();
        onSuccess();
      } else {
        console.log('Sign up failed:', error.message);
      }
    } catch (err) {
      console.log('Network error occurred');
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
