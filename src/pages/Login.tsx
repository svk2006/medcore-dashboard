import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, LogIn, UserPlus, CheckCircle2 } from 'lucide-react';

const DEPARTMENTS = [
  'Emergency', 'Cardiology', 'Orthopaedics', 'Internal Medicine',
  'General Surgery', 'Nephrology', 'Gastroenterology', 'Pulmonology',
  'Family Medicine', 'Obstetrics & Gynecology',
];

const Login = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    department: 'Emergency',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(form.email, form.password, form.full_name, form.department);
        if (error) throw error;
        toast({
          title: (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Account Created
            </span>
          ) as unknown as string,
          description: 'Please check your email to confirm your account.',
        });
      } else {
        const { error } = await signIn(form.email, form.password);
        if (error) throw error;
        toast({
          title: (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Welcome Back
            </span>
          ) as unknown as string,
          description: 'Successfully signed in to MedCoreOps.',
        });
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      toast({
        title: 'Authentication Error',
        description: err.message || 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in-up">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 animate-pulse-glow">
            <Activity className="h-7 w-7 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">MedCoreOps</h1>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mt-1">Clinical Admin Platform</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 space-y-5">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">{isSignUp ? 'Create Account' : 'Sign In'}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isSignUp ? 'Register to access the clinical dashboard' : 'Enter your credentials to continue'}
            </p>
          </div>

          {isSignUp && (
            <>
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Full Name</Label>
                <Input
                  value={form.full_name}
                  onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                  placeholder="Dr. Jane Smith"
                  className="bg-secondary border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Department</Label>
                <Select value={form.department} onValueChange={v => setForm(f => ({ ...f, department: v }))}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="doctor@hospital.org"
              className="bg-secondary border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</Label>
            <Input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="bg-secondary border-border"
              required
              minLength={6}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {isSignUp ? 'Creating…' : 'Signing in…'}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {isSignUp ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                {isSignUp ? 'Create Account' : 'Sign In'}
              </span>
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>

        <p className="text-center text-[10px] text-muted-foreground">v1.0 — Clinical Dashboard</p>
      </div>
    </div>
  );
};

export default Login;
