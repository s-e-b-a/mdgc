import { useStatistics } from '@/hooks/useStatistics';
import type { ApiError } from '@/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Gamepad2, Monitor, Headphones, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const { data: stats, isLoading, isError, error } = useStatistics();

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Dashboard</h2>
        <p className="text-muted-foreground">Loading statistics...</p>
      </div>
    );
  }

  if (isError || !stats) {
    const apiError = (error as Error & { apiError?: ApiError })?.apiError;
    const errorMessage = apiError?.message ?? 'Could not fetch stats.';
    return (
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Dashboard</h2>
        <p className="text-destructive">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-6">Dashboard</h2>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Video Games</CardTitle>
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVideoGames}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consoles</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConsoles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accessories</CardTitle>
            <Headphones className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAccessories}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalCollectionValue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail tables */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Games by Platform */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Games by Platform</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.gamesByPlatform.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data available.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Platform</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.gamesByPlatform.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">{item.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Games by Play State */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Games by Play State</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.gamesByPlayState.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data available.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Play State</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.gamesByPlayState.map((item) => (
                    <TableRow key={item.playState}>
                      <TableCell>{item.playState}</TableCell>
                      <TableCell className="text-right">{item.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
