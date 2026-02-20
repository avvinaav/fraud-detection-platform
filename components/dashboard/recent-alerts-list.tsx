'use client';
import { getRiskBgColor } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react';
import { Alert } from '@/types/analysis';
import { getRiskColor, getRiskLevel, formatTimestamp } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const mockAlerts: Alert[] = [
  {
    id: 'alert_001',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    confidenceScore: 0.92,
    status: 'new',
    sourcePreview: 'This revolutionary investment opportunity guarantees 300% returns...'
  },
  {
    id: 'alert_002',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    confidenceScore: 0.78,
    status: 'investigating',
    sourcePreview: 'Dear valued customer, your account has been compromised. Click here...'
  },
  {
    id: 'alert_003',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    confidenceScore: 0.85,
    status: 'new',
    sourcePreview: 'Congratulations! You have won $1,000,000 in our lottery draw...'
  },
  {
    id: 'alert_004',
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    confidenceScore: 0.34,
    status: 'false_positive',
    sourcePreview: 'Thank you for your recent purchase. Your order will arrive within 3-5...'
  },
  {
    id: 'alert_005',
    timestamp: new Date(Date.now() - 1000 * 60 * 240),
    confidenceScore: 0.91,
    status: 'resolved',
    sourcePreview: 'Urgent: Your payment is overdue. Send payment immediately to avoid...'
  },
];

const statusConfig = {
  new: { icon: AlertTriangle, label: 'New', color: 'text-yellow-500' },
  investigating: { icon: Clock, label: 'Investigating', color: 'text-blue-500' },
  resolved: { icon: CheckCircle, label: 'Resolved', color: 'text-green-500' },
  false_positive: { icon: CheckCircle, label: 'False Positive', color: 'text-zinc-500' },
};

export function RecentAlertsList() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Recent Alerts</h3>
          <p className="text-sm text-muted-foreground">
            Latest fraud detection results
          </p>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-900/50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                  ID
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                  Timestamp
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                  Preview
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                  Confidence
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mockAlerts.map((alert, index) => {
                const StatusIcon = statusConfig[alert.status].icon;
                const riskLevel = getRiskLevel(alert.confidenceScore);
                
                return (
                  <motion.tr
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b last:border-0 hover:bg-zinc-900/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono text-zinc-400">
                        {alert.id}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatTimestamp(alert.timestamp)}
                    </td>
                    <td className="px-4 py-3 text-sm max-w-xs">
                      <div className="truncate text-muted-foreground">
                        {alert.sourcePreview}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`text-sm font-semibold ${getRiskColor(riskLevel.level)}`}>
                          {(alert.confidenceScore * 100).toFixed(0)}%
                        </div>
                        <div className={`text-xs px-2 py-0.5 rounded-full border ${getRiskBgColor(riskLevel.level)}`}>
                          {riskLevel.level}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`w-4 h-4 ${statusConfig[alert.status].color}`} />
                        <span className="text-sm">
                          {statusConfig[alert.status].label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/investigate/${alert.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Investigate
                        </Button>
                      </Link>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
