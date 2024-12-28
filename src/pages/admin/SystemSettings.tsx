import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function SystemSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newValue, setNewValue] = useState("");

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .order('key');
      
      if (error) throw error;
      return data;
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string, value: any }) => {
      const { error } = await supabase
        .from('settings')
        .upsert({ key, value: JSON.stringify(value) });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({
        title: "Success",
        description: "Setting updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>
      
      <div className="grid gap-6">
        {settings?.map((setting) => (
          <Card key={setting.key}>
            <CardHeader>
              <CardTitle>{setting.key}</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Input
                defaultValue={JSON.stringify(setting.value)}
                onChange={(e) => setNewValue(e.target.value)}
              />
              <Button
                onClick={() => updateSettingMutation.mutate({
                  key: setting.key,
                  value: newValue
                })}
              >
                Update
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}