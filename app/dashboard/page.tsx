import { RiskHeatMap } from '@/components/dashboard/risk-heatmap';
import { RecentAlertsList } from '@/components/dashboard/recent-alerts-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Scans',
      value: '2,847',
      change: '+12.5%',
      icon: TrendingUp,
      color: 'text-blue-500',
    },
    {
      title: 'Threats Detected',
      value: '143',
      change: '+8.2%',
      icon: AlertTriangle,
      color: 'text-red-500',
    },
    {
      title: 'False Positives',
      value: '28',
      change: '-3.1%',
      icon: CheckCircle,
      color: 'text-emerald-500',
    },
    {
      title: 'Avg Analysis Time',
      value: '2.4s',
      change: '-15.3%',
      icon: Clock,
      color: 'text-yellow-500',
    },
  ];

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of fraud detection activity and performance metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={stat.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}>
                    {stat.change}
                  </span>
                  {' '}from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Heat Map */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Analysis</CardTitle>
          <CardDescription>
            Fraud detection patterns across time periods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RiskHeatMap />
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest fraud detection results and alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentAlertsList />
        </CardContent>
      </Card>
    </div>
  );
}
