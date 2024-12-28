import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, ShieldCheck, User } from "lucide-react";

interface TestAccountsAlertProps {
  onSelectTestAccount: (type: 'admin' | 'user') => void;
}

export const TestAccountsAlert = ({ onSelectTestAccount }: TestAccountsAlertProps) => {
  return (
    <Alert>
      <InfoIcon className="h-4 w-4" />
      <AlertDescription>
        Test Accounts Available:
        <div className="mt-2 space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-blue-500 text-blue-500 hover:bg-blue-50"
            onClick={() => onSelectTestAccount('admin')}
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
            onClick={() => onSelectTestAccount('user')}
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
  );
};