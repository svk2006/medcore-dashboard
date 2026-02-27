import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import logo from '@/assets/medcoreops-logo.png';

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast({
        title: (
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Email Sent
          </span>
        ) as unknown as string,
        description: 'Check your inbox for the password reset link.',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Could not send reset email.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in-up">
        <div className="flex flex-col items-center gap-3">
          <img src={logo} alt="MedCoreOps" className="h-16 w-16 rounded-2xl" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset Password</h1>
          <p className="text-sm text-muted-foreground text-center">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                We've sent a password reset link to <strong className="text-foreground">{email}</strong>. Check your inbox (and spam folder).
              </p>
              <Button variant="outline" className="w-full" onClick={() => setSent(false)}>
                Send again
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="doctor@hospital.org"
                  className="bg-secondary border-border"
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Sending…' : 'Send Reset Link'}
              </Button>
            </form>
          )}

          <div className="text-center">
            <Link to="/login" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
              <ArrowLeft className="h-3 w-3" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
