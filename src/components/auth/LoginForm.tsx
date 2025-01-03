import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createOrUpdateTestUser } from "@/utils/auth";
import { TestAccountsAlert } from "./TestAccountsAlert";
import { LoginFormFields } from "./LoginFormFields";

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
      
      if ((email === 'admin@example.com' && password === 'admin123') ||
          (email === 'user@example.com' && password === 'user123')) {
        console.log("Attempting test account login:", email);
        result = await createOrUpdateTestUser(
          email, 
          password, 
          email === 'admin@example.com'
        );
      } else {
        console.log("Attempting regular login:", email);
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
        throw new Error("No user returned after login");
      }

      // Wait a moment for the profile to be created
      await new Promise(resolve => setTimeout(resolve, 1000));

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
              <TestAccountsAlert onSelectTestAccount={setTestAccount} />
              <LoginFormFields
                email={email}
                password={password}
                loading={loading}
                onEmailChange={(e) => setEmail(e.target.value)}
                onPasswordChange={(e) => setPassword(e.target.value)}
                onSubmit={handleLogin}
              />
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