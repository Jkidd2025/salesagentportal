import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, ShieldCheck, User } from "lucide-react";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const createTestUser = async (email: string, password: string, isAdmin: boolean) => {
    try {
      // First try to sign up
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: isAdmin ? "Admin User" : "Regular User",
          }
        }
      });

      if (signUpError && signUpError.message !== "User already registered") {
        throw signUpError;
      }

      // If user exists or was created, update their profile
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: (await supabase.auth.getUser()).data.user?.id,
          full_name: isAdmin ? "Admin User" : "Regular User",
          is_admin: isAdmin,
          status: 'active'
        });

      if (updateError) {
        throw updateError;
      }

    } catch (error: any) {
      console.error("Error creating test user:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If login fails and it's a test account, try to create it
        if ((email === 'admin@example.com' && password === 'admin123') ||
            (email === 'user@example.com' && password === 'user123')) {
          await createTestUser(email, password, email === 'admin@example.com');
          // Try logging in again
          const { error: retryError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (retryError) {
            throw retryError;
          }
        } else {
          throw error;
        }
      }

      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin, full_name')
        .eq('id', user?.id)
        .single();

      toast({
        title: `Welcome ${profile?.full_name}!`,
        description: `You are logged in as a${profile?.is_admin ? 'n admin' : ' regular'} user.`,
        variant: "default",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate("/auth/signup");
  };

  const setTestAccount = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setEmail('admin@example.com');
      setPassword('admin123');
    } else {
      setEmail('user@example.com');
      setPassword('user123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  Test Accounts Available:
                  <div className="mt-2 space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-blue-500 text-blue-500 hover:bg-blue-50"
                      onClick={() => setTestAccount('admin')}
                    >
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Admin Account
                      <span className="ml-2 text-xs text-muted-foreground">
                        (admin@example.com / admin123)
                      </span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-green-500 text-green-500 hover:bg-green-50"
                      onClick={() => setTestAccount('user')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Regular User
                      <span className="ml-2 text-xs text-muted-foreground">
                        (user@example.com / user123)
                      </span>
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" onClick={handleSignUp}>
              Don't have an account? Sign up
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};