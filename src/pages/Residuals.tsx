import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Residuals = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Residuals</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Residual Income</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Residual management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Residuals;