import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, ShieldCheck, User } from "lucide-react";
import { createOrUpdateTestUser } from "@/utils/auth";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      
      // Check if it's a test account
      if ((email === 'admin@example.com' && password === 'admin123') ||
          (email === 'user@example.com' && password === 'user123')) {
        console.log("Attempting test account login:", email);
        // Handle test account login/creation
        result = await createOrUpdateTestUser(
          email, 
          password, 
          email === 'admin@example.com'
        );
      } else {
        console.log("Attempting regular login:", email);
        // Regular login attempt
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        result = { user: data.user, error };
      }

      if (result.error) {
        console.error("Login error:", result.error);
        throw result.error;
      }

      if (!result.user) {
        throw new Error("No user returned after login/signup");
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin, full_name')
        .eq('id', result.user.id)
        .single();

      toast({
        title: `Welcome ${profile?.full_name || 'back'}!`,
        description: `You are logged in as a${profile?.is_admin ? 'n admin' : ' regular'} user.`,
        variant: "default",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login form error:", error);
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