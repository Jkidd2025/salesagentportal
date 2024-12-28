import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export default function SystemBackups() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [description, setDescription] = useState("");

  const { data: backups, isLoading } = useQuery({
    queryKey: ['backups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_backups')
        .select(`
          *,
          profiles:created_by (
            full_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createBackupMutation = useMutation({
    mutationFn: async () => {
      // First, fetch all necessary data
      const [accounts, commissions, residuals] = await Promise.all([
        supabase.from('accounts').select('*'),
        supabase.from('commissions').select('*'),
        supabase.from('residuals').select('*'),
      ]);

      const backupData = {
        accounts: accounts.data,
        commissions: commissions.data,
        residuals: residuals.data,
        timestamp: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('system_backups')
        .insert({
          backup_data: backupData,
          description,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backups'] });
      toast({
        title: "Success",
        description: "Backup created successfully",
      });
      setDescription("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const restoreBackupMutation = useMutation({
    mutationFn: async (backupId: string) => {
      const { data: backup } = await supabase
        .from('system_backups')
        .select('backup_data')
        .eq('id', backupId)
        .single();

      if (!backup) throw new Error("Backup not found");

      // Restore data in sequence
      await supabase.from('accounts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('accounts').insert(backup.backup_data.accounts);
      
      await supabase.from('commissions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('commissions').insert(backup.backup_data.commissions);
      
      await supabase.from('residuals').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('residuals').insert(backup.backup_data.residuals);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast({
        title: "Success",
        description: "System restored successfully",
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
      <h1 className="text-2xl font-bold mb-6">System Backups</h1>
      
      <div className="flex gap-4 mb-8">
        <Input
          placeholder="Backup description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
          onClick={() => createBackupMutation.mutate()}
          disabled={createBackupMutation.isPending}
        >
          Create Backup
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {backups?.map((backup) => (
            <TableRow key={backup.id}>
              <TableCell>{backup.description || '-'}</TableCell>
              <TableCell>{backup.profiles?.full_name}</TableCell>
              <TableCell>
                {new Date(backup.created_at).toLocaleString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => restoreBackupMutation.mutate(backup.id)}
                  disabled={restoreBackupMutation.isPending}
                >
                  Restore
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}