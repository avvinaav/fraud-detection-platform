'use client';

import { motion } from 'framer-motion';
import { getRiskBgColor, getRiskLevel } from '@/lib/utils';

interface HeatMapData {
  hour: number;
  day: string;
  count: number;
  avgScore: number;
}

const mockData: HeatMapData[] = [
  { hour: 9, day: 'Mon', count: 5, avgScore: 0.72 },
  { hour: 10, day: 'Mon', count: 8, avgScore: 0.45 },
  { hour: 14, day: 'Mon', count: 12, avgScore: 0.88 },
  { hour: 9, day: 'Tue', count: 3, avgScore: 0.34 },
  { hour: 11, day: 'Tue', count: 15, avgScore: 0.91 },
  { hour: 15, day: 'Tue', count: 7, avgScore: 0.56 },
  { hour: 10, day: 'Wed', count: 9, avgScore: 0.67 },
  { hour: 13, day: 'Wed', count: 11, avgScore: 0.78 },
  { hour: 16, day: 'Wed', count: 6, avgScore: 0.42 },
  { hour: 9, day: 'Thu', count: 14, avgScore: 0.85 },
  { hour: 12, day: 'Thu', count: 10, avgScore: 0.71 },
  { hour: 15, day: 'Thu', count: 4, avgScore: 0.38 },
  { hour: 10, day: 'Fri', count: 13, avgScore: 0.79 },
  { hour: 14, day: 'Fri', count: 8, avgScore: 0.62 },
  { hour: 17, day: 'Fri', count: 5, avgScore: 0.47 },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const hours = Array.from({ length: 12 }, (_, i) => i + 8);

export function RiskHeatMap() {
  const getDataPoint = (day: string, hour: number) => {
    return mockData.find(d => d.day === day && d.hour === hour);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Fraud Detection Heatmap</h3>
          <p className="text-sm text-muted-foreground">
            Activity patterns by day and hour
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500/20" />
            <span>Low Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-500/20" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500/20" />
            <span>High Risk</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${hours.length}, 1fr)` }}>
            {/* Header row */}
            <div className="h-8" />
            {hours.map(hour => (
              <div key={hour} className="text-xs text-center text-muted-foreground py-2">
                {hour}:00
              </div>
            ))}

            {/* Data rows */}
            {days.map((day, dayIndex) => (
              <React.Fragment key={day}>
                <div className="flex items-center justify-end pr-3 text-xs font-medium">
                  {day}
                </div>
                {hours.map((hour, hourIndex) => {
                  const data = getDataPoint(day, hour);
                  const riskLevel = data ? getRiskLevel(data.avgScore) : null;
                  const delay = (dayIndex * hours.length + hourIndex) * 0.01;

                  return (
                    <motion.div
                      key={`${day}-${hour}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay, duration: 0.2 }}
                      className={`
                        aspect-square rounded border cursor-pointer
                        transition-all hover:scale-105 hover:shadow-lg
                        ${data ? getRiskBgColor(riskLevel!.level) : 'bg-zinc-900/50 border-zinc-800'}
                      `}
                      title={data ? `${data.count} detections, ${(data.avgScore * 100).toFixed(0)}% avg risk` : 'No data'}
                    >
                      {data && (
                        <div className="w-full h-full flex flex-col items-center justify-center text-xs">
                          <div className="font-bold">{data.count}</div>
                          <div className="text-[10px] opacity-70">
                            {(data.avgScore * 100).toFixed(0)}%
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
