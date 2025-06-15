import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignIn } from '@/hooks/useSignIn';

interface SignInFormProps {
  onSwitchToSignUp: () => void;
}

const SignInForm = ({ onSwitchToSignUp }: SignInFormProps) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleSignIn
  } = useSignIn();

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
      
      <div className="text-center">
        <Button 
          type="button" 
          variant="link" 
          onClick={onSwitchToSignUp}
          className="text-sm"
        >
          Don't have an account? Sign up
        </Button>
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Demo Admin Account:</p>
        <p>Email: admin@mobilerepairwala.com</p>
        <p>Password: admin123</p>
      </div>
    </form>
  );
};

export default SignInForm;