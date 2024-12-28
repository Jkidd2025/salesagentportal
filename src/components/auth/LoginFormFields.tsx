import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LoginFormFieldsProps {
  email: string;
  password: string;
  loading: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const LoginFormFields = ({
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormFieldsProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={onEmailChange}
          required
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={onPasswordChange}
          required
          autoComplete="current-password"
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};