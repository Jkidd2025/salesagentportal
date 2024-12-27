import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Commissions = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Commissions</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commission History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Commission management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Commissions;